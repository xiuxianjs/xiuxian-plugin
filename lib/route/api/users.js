import { validateToken, getAllUsers, createUser, deleteUser } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';

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
        if (!user || user.role !== 'admin') {
            ctx.status = 403;
            ctx.body = {
                code: 403,
                message: '权限不足',
                data: null
            };
            return;
        }
        const users = await getAllUsers();
        const usersWithoutPassword = users.map(({ password: _, ...user }) => user);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户列表成功',
            data: usersWithoutPassword
        };
    }
    catch (error) {
        logger.error('获取用户列表错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const POST = async (ctx) => {
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
        const currentUser = await validateToken(token);
        if (!currentUser || currentUser.role !== 'admin') {
            ctx.status = 403;
            ctx.body = {
                code: 403,
                message: '权限不足',
                data: null
            };
            return;
        }
        const body = await parseJsonBody(ctx);
        const { username, password, role = 'admin' } = body;
        if (!username || !password) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户名和密码不能为空',
                data: null
            };
            return;
        }
        const newUser = await createUser(username, password, role);
        if (newUser) {
            const { password: _, ...userWithoutPassword } = newUser;
            ctx.status = 201;
            ctx.body = {
                code: 201,
                message: '用户创建成功',
                data: userWithoutPassword
            };
        }
        else {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户名已存在',
                data: null
            };
        }
    }
    catch (error) {
        logger.error('创建用户错误:', error);
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
        const currentUser = await validateToken(token);
        if (!currentUser || currentUser.role !== 'admin') {
            ctx.status = 403;
            ctx.body = {
                code: 403,
                message: '权限不足',
                data: null
            };
            return;
        }
        const body = await parseJsonBody(ctx);
        const { userId } = body;
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
                message: '用户不存在',
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

export { DELETE, GET, POST };
