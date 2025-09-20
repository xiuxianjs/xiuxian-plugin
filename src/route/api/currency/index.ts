import { Context } from 'koa';
import { validatePermission, Permission } from '@src/route/core/auth';
import { RECHARGE_TIERS, MONTH_CARD_CONFIG, RechargeType, PaymentStatus } from '@src/model/currency';

// 默认返回配置信息（保持向后兼容）
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.GAME_CURRENCY]);

    if (!res) {
      return;
    }

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取配置信息成功',
      data: {
        rechargeTiers: RECHARGE_TIERS,
        monthCardConfig: MONTH_CARD_CONFIG,
        rechargeTypes: RechargeType,
        paymentStatuses: PaymentStatus
      }
    };
  } catch (error) {
    logger.error('获取配置信息错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
