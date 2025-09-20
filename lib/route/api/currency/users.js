import { validatePermission, Permission } from '../../core/auth.js';
import { getAllUsersCurrencyInfo, findUserRechargeInfo } from '../../../model/currency.js';

const GET = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_CURRENCY]);
        if (!res) {
            return;
        }
        const users = await getAllUsersCurrencyInfo();
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户货币信息成功',
            data: users
        };
    }
    catch (error) {
        logger.error('获取用户货币信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const GET_USER = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_CURRENCY]);
        if (!res) {
            return;
        }
        const userId = ctx.request.query.userId;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const userInfo = await findUserRechargeInfo(userId);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户货币信息成功',
            data: userInfo
        };
    }
    catch (error) {
        logger.error('获取用户货币信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, GET_USER };
