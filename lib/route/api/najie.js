import { validateToken } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { getIoRedis } from '@alemonjs/db';
import { __PATH } from '../../model/paths.js';

const redis = getIoRedis();
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
        const page = parseInt(ctx.request.query.page) || 1;
        const pageSize = parseInt(ctx.request.query.pageSize) || 20;
        const search = ctx.request.query.search || '';
        const category = ctx.request.query.category || 'all';
        const najieList = [];
        let total = 0;
        const scanPattern = `${__PATH.najie_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        if (search || category !== 'all') {
            for (const key of allKeys) {
                const userId = key.replace(`${__PATH.najie_path}:`, '');
                const najieData = await redis.get(key);
                if (najieData) {
                    try {
                        const najie = JSON.parse(decodeURIComponent(najieData));
                        const najieWithId = {
                            userId,
                            ...najie
                        };
                        const matchesSearch = !search || userId.includes(search);
                        const matchesCategory = category === 'all' || najie[category];
                        if (matchesSearch && matchesCategory) {
                            total++;
                            const startIndex = (page - 1) * pageSize;
                            if (najieList.length < pageSize && total > startIndex) {
                                najieList.push(najieWithId);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`解析背包数据失败 ${userId}:`, error);
                    }
                }
            }
        }
        else {
            total = allKeys.length;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedKeys = allKeys.slice(startIndex, endIndex);
            for (const key of paginatedKeys) {
                const userId = key.replace(`${__PATH.najie_path}:`, '');
                const najieData = await redis.get(key);
                if (najieData) {
                    try {
                        const najie = JSON.parse(decodeURIComponent(najieData));
                        const najieWithId = {
                            userId,
                            ...najie
                        };
                        najieList.push(najieWithId);
                    }
                    catch (error) {
                        console.error(`解析背包数据失败 ${userId}:`, error);
                    }
                }
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取背包列表成功',
            data: {
                list: najieList,
                pagination: {
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        };
    }
    catch (error) {
        console.error('获取背包列表错误:', error);
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
        const najieData = await redis.get(`${__PATH.najie_path}:${userId}`);
        if (!najieData) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '背包不存在',
                data: null
            };
            return;
        }
        const najie = JSON.parse(decodeURIComponent(najieData));
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取背包详情成功',
            data: {
                userId,
                ...najie
            }
        };
    }
    catch (error) {
        console.error('获取背包详情错误:', error);
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
        const search = ctx.request.query.search || '';
        const scanPattern = `${__PATH.najie_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        let total = 0;
        let totalLingshi = 0;
        let totalItems = 0;
        const categoryStats = {
            装备: 0,
            丹药: 0,
            道具: 0,
            功法: 0,
            草药: 0,
            材料: 0,
            仙宠: 0,
            仙宠口粮: 0
        };
        if (search) {
            for (const key of allKeys) {
                const userId = key.replace(`${__PATH.najie_path}:`, '');
                const najieData = await redis.get(key);
                if (najieData) {
                    try {
                        const najie = JSON.parse(decodeURIComponent(najieData));
                        const matchesSearch = !search || userId.includes(search);
                        if (matchesSearch) {
                            total++;
                            totalLingshi += najie.灵石 || 0;
                            Object.keys(categoryStats).forEach(cat => {
                                if (Array.isArray(najie[cat])) {
                                    categoryStats[cat] += najie[cat].length;
                                    totalItems += najie[cat].length;
                                }
                            });
                        }
                    }
                    catch (error) {
                        console.error(`解析背包数据失败 ${userId}:`, error);
                    }
                }
            }
        }
        else {
            total = allKeys.length;
            const sampleKeys = allKeys.slice(0, Math.min(50, allKeys.length));
            for (const key of sampleKeys) {
                const userId = key.replace(`${__PATH.najie_path}:`, '');
                const najieData = await redis.get(key);
                if (najieData) {
                    try {
                        const najie = JSON.parse(decodeURIComponent(najieData));
                        totalLingshi += najie.灵石 || 0;
                        Object.keys(categoryStats).forEach(cat => {
                            if (Array.isArray(najie[cat])) {
                                categoryStats[cat] += najie[cat].length;
                                totalItems += najie[cat].length;
                            }
                        });
                    }
                    catch (error) {
                        console.error(`解析背包数据失败 ${userId}:`, error);
                    }
                }
            }
            if (sampleKeys.length > 0) {
                const ratio = allKeys.length / sampleKeys.length;
                totalLingshi = Math.round(totalLingshi * ratio);
                totalItems = Math.round(totalItems * ratio);
                Object.keys(categoryStats).forEach(cat => {
                    categoryStats[cat] = Math.round(categoryStats[cat] * ratio);
                });
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取统计信息成功',
            data: {
                total,
                totalLingshi,
                totalItems,
                categoryStats
            }
        };
    }
    catch (error) {
        console.error('获取统计信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
