import { validateRole } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { getUserMessages, sendMessage, markMessageAsRead, deleteMessage } from '../../model/message.js';
import { logger } from 'alemonjs';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const { userId } = ctx.request.query;
        if (!userId || typeof userId !== 'string') {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const queryParams = {};
        const page = parseInt(ctx.request.query.page);
        const pageSize = parseInt(ctx.request.query.pageSize);
        const type = ctx.request.query.type;
        const status = parseInt(ctx.request.query.status);
        const priority = parseInt(ctx.request.query.priority);
        const keyword = ctx.request.query.keyword;
        if (!isNaN(page)) {
            queryParams.page = page;
        }
        if (!isNaN(pageSize)) {
            queryParams.pageSize = pageSize;
        }
        if (type) {
            queryParams.type = type;
        }
        if (!isNaN(status)) {
            queryParams.status = status;
        }
        if (!isNaN(priority)) {
            queryParams.priority = priority;
        }
        if (keyword) {
            queryParams.keyword = keyword;
        }
        const result = await getUserMessages(userId, queryParams);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取用户站内信成功',
            data: result
        };
    }
    catch (error) {
        logger.error('获取用户站内信失败:', error);
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
        const body = await parseJsonBody(ctx);
        const { title, content, type, priority, receivers, expireTime } = body;
        if (!title || !content || !type) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '标题、内容和类型不能为空',
                data: null
            };
            return;
        }
        const result = await sendMessage({
            title,
            content,
            type,
            priority,
            receivers: receivers || [],
            expireTime
        });
        if (result.success) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: result.message,
                data: result.data
            };
        }
        else {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: result.message,
                data: null
            };
        }
    }
    catch (error) {
        logger.error('发送站内信失败:', error);
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
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = await parseJsonBody(ctx);
        const { userId, messageId } = body;
        if (!userId || !messageId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID和消息ID不能为空',
                data: null
            };
            return;
        }
        const result = await markMessageAsRead(userId, messageId);
        if (result.success) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: result.message,
                data: null
            };
        }
        else {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: result.message,
                data: null
            };
        }
    }
    catch (error) {
        logger.error('标记消息为已读失败:', error);
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
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = await parseJsonBody(ctx);
        const { userId, messageId } = body;
        if (!userId || !messageId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID和消息ID不能为空',
                data: null
            };
            return;
        }
        const result = await deleteMessage(userId, messageId);
        if (result.success) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: result.message,
                data: null
            };
        }
        else {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: result.message,
                data: null
            };
        }
    }
    catch (error) {
        logger.error('删除消息失败:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { DELETE, GET, POST, PUT };
