import { validatePermission, Permission } from '../../core/auth.js';
import { consumeMonthCardDays, consumeUserCurrency } from '../../../model/currency.js';

const PUT = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_CURRENCY]);
        if (!res) {
            return;
        }
        const body = ctx.request.body;
        const { action, userId, amount, cardType, days } = body;
        switch (action) {
            case 'consume-currency': {
                if (!userId || !amount) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '用户ID和消费金额不能为空',
                        data: null
                    };
                    return;
                }
                const currencySuccess = await consumeUserCurrency(userId, amount);
                if (currencySuccess) {
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        message: '消费金币成功',
                        data: null
                    };
                }
                else {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '金币余额不足',
                        data: null
                    };
                }
                break;
            }
            case 'consume-month-card': {
                if (!userId || !cardType || !days) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '用户ID、月卡类型和天数不能为空',
                        data: null
                    };
                    return;
                }
                const monthCardSuccess = await consumeMonthCardDays(userId, cardType, days);
                if (monthCardSuccess) {
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        message: '消费月卡天数成功',
                        data: null
                    };
                }
                else {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '月卡天数不足',
                        data: null
                    };
                }
                break;
            }
            default:
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: '无效的操作类型',
                    data: null
                };
        }
    }
    catch (error) {
        logger.error('消费用户货币错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { PUT };
