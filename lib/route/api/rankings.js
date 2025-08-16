import { validateToken } from '../core/auth.js';
import { getRankingData, getRankingStats, triggerRankingCalculation } from '../../task/RankingTask.js';

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
        const type = ctx.request.query.type;
        const limit = parseInt(ctx.request.query.limit) || 10;
        if (!type) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '排名类型不能为空',
                data: null
            };
            return;
        }
        const rankings = await getRankingData(type, limit);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取排名数据成功',
            data: rankings
        };
    }
    catch (error) {
        console.error('获取排名数据错误:', error);
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
        const stats = await getRankingStats();
        if (!stats) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '排名数据不存在',
                data: null
            };
            return;
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取排名统计成功',
            data: stats
        };
    }
    catch (error) {
        console.error('获取排名统计错误:', error);
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
        await triggerRankingCalculation();
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '排名计算已触发',
            data: {
                timestamp: new Date().toISOString()
            }
        };
    }
    catch (error) {
        console.error('触发排名计算错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
