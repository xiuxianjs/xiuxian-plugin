import { Context } from 'koa';
import { getIoRedis } from '@alemonjs/db';
import { validatePermission, Permission } from '../core/auth';

// 获取禁言日志
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MUTE_MANAGE]);

    if (!res) {
      return;
    }

    const { type = 'mute', limit = 100 } = ctx.query;
    const redis = getIoRedis();

    const logs: any[] = [];
    const logKey = type === 'unmute' ? 'unmute_logs' : 'mute_logs';

    // 获取日志列表
    const logList = await redis.lrange(logKey, 0, parseInt(limit as string) - 1);

    for (const logStr of logList) {
      try {
        const log = JSON.parse(logStr);

        logs.push({
          ...log,
          timestamp: new Date(log.timestamp).toISOString()
        });
      } catch (error) {
        logger.error('解析日志失败:', error);
      }
    }

    // 按时间倒序排列
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取禁言日志成功',
      data: {
        list: logs,
        total: logs.length,
        type
      }
    };
  } catch (error) {
    logger.error('获取禁言日志错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 清理日志
export const DELETE = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MUTE_MANAGE]);

    if (!res) {
      return;
    }

    const { type = 'all' } = ctx.query;
    const redis = getIoRedis();

    let deletedCount = 0;

    if (type === 'all' || type === 'mute') {
      await redis.del('mute_logs');
      deletedCount++;
    }

    if (type === 'all' || type === 'unmute') {
      await redis.del('unmute_logs');
      deletedCount++;
    }

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: `清理日志成功，清理了 ${deletedCount} 个日志文件`,
      data: {
        deletedCount
      }
    };
  } catch (error) {
    logger.error('清理日志错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
