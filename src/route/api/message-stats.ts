import { Context } from 'koa';
import { validatePermission, Permission } from '@src/route/core/auth';
import { logger } from 'alemonjs';
import { getUserMessageStats, getGlobalMessageStats, cleanExpiredMessages } from '@src/model/message';

// 获取用户消息统计
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const { userId } = ctx.request.query;
    const { global } = ctx.request.query;

    if (global === 'true') {
      // 获取全服统计
      const stats = await getGlobalMessageStats();

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '获取全服消息统计成功',
        data: stats
      };
    } else {
      // 获取指定用户统计
      if (!userId || typeof userId !== 'string') {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '用户ID不能为空',
          data: null
        };

        return;
      }

      const stats = await getUserMessageStats(userId);

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '获取用户消息统计成功',
        data: stats
      };
    }
  } catch (error) {
    logger.error('获取消息统计失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 清理过期消息
export const POST = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const cleanedCount = await cleanExpiredMessages();

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: `清理过期消息成功，共清理 ${cleanedCount} 条消息`,
      data: { cleanedCount }
    };
  } catch (error) {
    logger.error('清理过期消息失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
