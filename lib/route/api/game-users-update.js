import { validateRole } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { getIoRedis } from '@alemonjs/db';
import { __PATH } from '../../model/keys.js';

const redis = getIoRedis();
const PUT = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = await parseJsonBody(ctx);
        if (!body) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '请求体不能为空',
                data: null
            };
            return;
        }
        const { id, ...updateData } = body;
        if (!id) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const userKey = `${__PATH.player_path}:${id}`;
        const existingData = await redis.get(userKey);
        if (!existingData) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在',
                data: null
            };
            return;
        }
        let existingUser;
        try {
            existingUser = JSON.parse(existingData);
        }
        catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '用户数据格式错误',
                data: null
            };
            return;
        }
        const updatedUser = {
            ...existingUser,
            ...updateData
        };
        await redis.set(userKey, JSON.stringify(updatedUser));
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '用户更新成功',
            data: {
                id,
                ...updatedUser
            }
        };
    }
    catch (error) {
        logger.error('更新用户数据错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { PUT };
