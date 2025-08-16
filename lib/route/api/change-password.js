import { validateToken, setUserPassword } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';

const POST = async (ctx) => {
    try {
        const token = ctx.request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: 'Token不能为空',
                data: null
            };
            return;
        }
        const user = await validateToken(token);
        if (!user) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: 'Token无效或已过期',
                data: null
            };
            return;
        }
        const body = await parseJsonBody(ctx);
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '当前密码和新密码不能为空',
                data: null
            };
            return;
        }
        if (newPassword.length < 6) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '新密码长度至少6位',
                data: null
            };
            return;
        }
        if (user.password !== currentPassword) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '当前密码错误',
                data: null
            };
            return;
        }
        await setUserPassword(user.id, newPassword);
        logger.info(`用户 ${user.username} 修改了密码`);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '密码修改成功',
            data: null
        };
    }
    catch (error) {
        logger.error('修改密码接口错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { POST };
