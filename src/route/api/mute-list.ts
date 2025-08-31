import { Context } from 'koa';
import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';
import { parseJsonBody } from '../core/bodyParser';
import { validateRole } from '../core/auth';

// 获取禁言列表
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const redis = getIoRedis();
    const mutePattern = keys.mute('*');
    const muteKeys = await redis.keys(mutePattern);

    const muteList: any[] = [];

    for (const key of muteKeys) {
      const userId = key.replace(keys.mute(''), '');
      const ttl = await redis.ttl(key);

      if (ttl > 0) {
        // 计算剩余时间
        const now = new Date();
        const unlockTime = new Date(now.getTime() + ttl * 1000);

        muteList.push({
          userId,
          ttl,
          unlockTime: unlockTime.toISOString(),
          remainingTime: formatRemainingTime(ttl)
        });
      }
    }

    // 按剩余时间排序
    muteList.sort((a, b) => b.ttl - a.ttl);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取禁言列表成功',
      data: {
        list: muteList,
        total: muteList.length
      }
    };
  } catch (error) {
    logger.error('获取禁言列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 添加禁言
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);

    if (!body) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请求体不能为空',
        data: null
      };

      return;
    }

    const { userId, duration, reason } = body;

    if (!userId || !duration) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID和禁言时长不能为空',
        data: null
      };

      return;
    }

    // 验证时长格式 (支持小时和分钟)
    let seconds = 0;

    if (typeof duration === 'number') {
      seconds = duration * 60; // 默认按分钟处理
    } else if (typeof duration === 'string') {
      const match = duration.match(/^(\d+)(h|m|s)$/);

      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
          case 'h':
            seconds = value * 3600;
            break;
          case 'm':
            seconds = value * 60;
            break;
          case 's':
            seconds = value;
            break;
        }
      } else {
        seconds = parseInt(duration) * 60; // 默认按分钟处理
      }
    }

    if (seconds <= 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '禁言时长必须大于0',
        data: null
      };

      return;
    }

    const redis = getIoRedis();

    // 检查用户是否已存在
    const exist = await redis.exists(keys.player(userId));

    if (exist === 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户不存在',
        data: null
      };

      return;
    }

    // 设置禁言
    await redis.setex(keys.mute(userId), seconds, '1');

    // 记录禁言日志
    const muteLog = {
      userId,
      duration: seconds,
      reason: reason || '管理员手动禁言',
      adminId: res.userId,
      timestamp: new Date().toISOString()
    };

    await redis.lpush('mute_logs', JSON.stringify(muteLog));
    await redis.ltrim('mute_logs', 0, 999); // 保留最近1000条记录

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '禁言设置成功',
      data: {
        userId,
        duration: seconds,
        unlockTime: new Date(Date.now() + seconds * 1000).toISOString()
      }
    };
  } catch (error) {
    logger.error('设置禁言错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 解除禁言
export const DELETE = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const { userId } = ctx.query;

    if (!userId || typeof userId !== 'string') {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    const redis = getIoRedis();

    // 检查用户是否被禁言
    const muteExists = await redis.exists(keys.mute(userId));

    if (muteExists === 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户未被禁言',
        data: null
      };

      return;
    }

    // 解除禁言
    await redis.del(keys.mute(userId));

    // 记录解除禁言日志
    const unmuteLog = {
      userId,
      adminId: res.userId,
      timestamp: new Date().toISOString()
    };

    await redis.lpush('unmute_logs', JSON.stringify(unmuteLog));
    await redis.ltrim('unmute_logs', 0, 999); // 保留最近1000条记录

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '禁言解除成功',
      data: {
        userId
      }
    };
  } catch (error) {
    logger.error('解除禁言错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 批量解除禁言
export const PUT = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);

    if (!body) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请求体不能为空',
        data: null
      };

      return;
    }

    const { userIds } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID列表不能为空',
        data: null
      };

      return;
    }

    const redis = getIoRedis();
    const results: any[] = [];

    for (const userId of userIds) {
      const muteExists = await redis.exists(keys.mute(userId));

      if (muteExists > 0) {
        await redis.del(keys.mute(userId));
        results.push({ userId, success: true });
      } else {
        results.push({ userId, success: false, message: '用户未被禁言' });
      }
    }

    const successCount = results.filter(r => r.success).length;

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: `批量解除禁言完成，成功解除 ${successCount} 个用户`,
      data: {
        results,
        total: userIds.length,
        successCount
      }
    };
  } catch (error) {
    logger.error('批量解除禁言错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 格式化剩余时间
function formatRemainingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
}
