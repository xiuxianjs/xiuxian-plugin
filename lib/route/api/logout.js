import { logout } from '../core/auth.js';

const POST = async (ctx) => {
    try {
        const body = ctx.request.body;
        const token = ctx.request.headers.authorization?.replace('Bearer ', '') || body.token;
        if (!token) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'Token不能为空',
                data: null
            };
            return;
        }
        const success = await logout(token);
        if (success) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '登出成功',
                data: null
            };
        }
        else {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '登出失败',
                data: null
            };
        }
    }
    catch (error) {
        logger.error('登出接口错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { POST };
