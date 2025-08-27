import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';
import {
  RECHARGE_TIERS,
  MONTH_CARD_CONFIG,
  CURRENCY_CONFIG,
  RechargeType,
  PaymentStatus,
  getAmountByTier,
  calculateCurrencyGained,
  calculateFirstRechargeBonus
} from '@src/model/currency';

// 获取配置信息
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    // 计算每个档位的详细信息
    const rechargeTiersWithDetails = Object.entries(RECHARGE_TIERS).map(([key, tier]) => ({
      key,
      ...tier,
      currencyGained: calculateCurrencyGained(tier.amount),
      firstRechargeBonus: calculateFirstRechargeBonus(tier.amount)
    }));

    // 计算月卡详细信息
    const monthCardsWithDetails = {
      SMALL: {
        ...MONTH_CARD_CONFIG.SMALL,
        currencyGained: calculateCurrencyGained(MONTH_CARD_CONFIG.SMALL.price),
        firstRechargeBonus: calculateFirstRechargeBonus(MONTH_CARD_CONFIG.SMALL.price)
      },
      BIG: {
        ...MONTH_CARD_CONFIG.BIG,
        currencyGained: calculateCurrencyGained(MONTH_CARD_CONFIG.BIG.price),
        firstRechargeBonus: calculateFirstRechargeBonus(MONTH_CARD_CONFIG.BIG.price)
      }
    };

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取配置信息成功',
      data: {
        currencyConfig: CURRENCY_CONFIG,
        rechargeTiers: rechargeTiersWithDetails,
        monthCardConfig: monthCardsWithDetails,
        rechargeTypes: RechargeType,
        paymentStatuses: PaymentStatus,
        // 提供工具函数供前端使用
        utils: {
          getAmountByTier: (tier: string) => {
            try {
              return getAmountByTier(tier);
            } catch {
              return null;
            }
          },
          calculateCurrencyGained,
          calculateFirstRechargeBonus
        }
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
