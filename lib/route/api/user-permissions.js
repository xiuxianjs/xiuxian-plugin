import { validateToken, getUserPermissionsByRole, getRoleInfo } from '../core/auth.js';

const GET = async (ctx) => {
    try {
        const token = ctx.request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '需要登录',
                data: null
            };
            return;
        }
        const user = await validateToken(token);
        if (!user) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: 'Token无效',
                data: null
            };
            return;
        }
        const userPermissions = getUserPermissionsByRole(user.role);
        const roleInfo = getRoleInfo(user.role);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户权限成功',
            data: {
                userId: user.id,
                username: user.username,
                role: user.role,
                permissions: userPermissions,
                roleInfo: roleInfo
            }
        };
    }
    catch (error) {
        logger.error('获取用户权限错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET };
