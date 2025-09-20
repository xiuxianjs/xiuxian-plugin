import { validatePermission, Permission, getUserById, updateUserRole, deleteUser } from '../../../core/auth.js';

const GET = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.USER_VIEW]);
        if (!res) {
            return;
        }
        const userId = ctx.params.userId;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const user = await getUserById(userId);
        if (!user) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在',
                data: null
            };
            return;
        }
        const { password: _, ...userWithoutPassword } = user;
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户详情成功',
            data: userWithoutPassword
        };
    }
    catch (error) {
        logger.error('获取用户详情错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const PUT = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.USER_UPDATE]);
        if (!res) {
            return;
        }
        const userId = ctx.params.userId;
        const body = ctx.request.body;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        if (!body) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '请求体不能为空',
                data: null
            };
            return;
        }
        const { role } = body;
        if (role) {
            const success = await updateUserRole(userId, role);
            if (!success) {
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: '更新用户角色失败',
                    data: null
                };
                return;
            }
        }
        const updatedUser = await getUserById(userId);
        if (!updatedUser) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在',
                data: null
            };
            return;
        }
        const { password: _, ...userWithoutPassword } = updatedUser;
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '更新用户信息成功',
            data: userWithoutPassword
        };
    }
    catch (error) {
        logger.error('更新用户信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const DELETE = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.USER_DELETE]);
        if (!res) {
            return;
        }
        const userId = ctx.params.userId;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const success = await deleteUser(userId);
        if (success) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '用户删除成功',
                data: null
            };
        }
        else {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在或无法删除超级管理员',
                data: null
            };
        }
    }
    catch (error) {
        logger.error('删除用户错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { DELETE, GET, PUT };
