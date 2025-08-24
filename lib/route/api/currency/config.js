import { validateRole } from '../../core/auth.js';
import { RECHARGE_TIERS, calculateFirstRechargeBonus, calculateCurrencyGained, MONTH_CARD_CONFIG, PaymentStatus, RechargeType, CURRENCY_CONFIG, getAmountByTier } from '../../../model/currency.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const rechargeTiersWithDetails = Object.entries(RECHARGE_TIERS).map(([key, tier]) => ({
            key,
            ...tier,
            currencyGained: calculateCurrencyGained(tier.amount),
            firstRechargeBonus: calculateFirstRechargeBonus(tier.amount)
        }));
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
                utils: {
                    getAmountByTier: (tier) => {
                        try {
                            return getAmountByTier(tier);
                        }
                        catch {
                            return null;
                        }
                    },
                    calculateCurrencyGained,
                    calculateFirstRechargeBonus
                }
            }
        };
    }
    catch (error) {
        logger.error('获取配置信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET };
