import { Context } from 'koa';
import { validatePermission, Permission } from '@src/route/core/auth';
import { getGlobalRechargeStats } from '@src/model/currency';

// 获取全局充值统计
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.GAME_CURRENCY]);

    if (!res) {
      return;
    }

    const stats = await getGlobalRechargeStats();

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取全局充值统计成功',
      data: stats
    };
  } catch (error) {
    logger.error('获取全局充值统计错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
