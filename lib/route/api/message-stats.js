import { validateRole } from '../core/auth.js';
import { logger } from 'alemonjs';
import { getGlobalMessageStats, getUserMessageStats, cleanExpiredMessages } from '../../model/message.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const { userId } = ctx.request.query;
        const { global } = ctx.request.query;
        if (global === 'true') {
            const stats = await getGlobalMessageStats();
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '获取全服消息统计成功',
                data: stats
            };
        }
        else {
            if (!userId || typeof userId !== 'string') {
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: '用户ID不能为空',
                    data: null
                };
                return;
            }
            const stats = await getUserMessageStats(userId);
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '获取用户消息统计成功',
                data: stats
            };
        }
    }
    catch (error) {
        logger.error('获取消息统计失败:', error);
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
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const cleanedCount = await cleanExpiredMessages();
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: `清理过期消息成功，共清理 ${cleanedCount} 条消息`,
            data: { cleanedCount }
        };
    }
    catch (error) {
        logger.error('清理过期消息失败:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST };
