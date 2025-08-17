import { validateRole } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { getIoRedis } from '@alemonjs/db';
import { __PATH, keys } from '../../model/keys.js';

const redis = getIoRedis();
const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const page = parseInt(ctx.request.query.page) || 1;
        const pageSize = parseInt(ctx.request.query.pageSize) || 20;
        const search = ctx.request.query.search || '';
        const category = ctx.request.query.category || 'all';
        const stats = ctx.request.query.stats === 'true';
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
                        const najie = JSON.parse(najieData);
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
                        logger.error(`解析背包数据失败 ${userId}:`, error);
                        const corruptedNajie = {
                            userId,
                            灵石: 0,
                            装备: [],
                            丹药: [],
                            道具: [],
                            功法: [],
                            草药: [],
                            材料: [],
                            仙宠: [],
                            仙宠口粮: [],
                            数据状态: 'corrupted',
                            原始数据: najieData,
                            错误信息: error.message
                        };
                        const matchesSearch = !search || userId.includes(search);
                        const matchesCategory = category === 'all' || true;
                        if (matchesSearch && matchesCategory) {
                            total++;
                            const startIndex = (page - 1) * pageSize;
                            if (najieList.length < pageSize && total > startIndex) {
                                najieList.push(corruptedNajie);
                            }
                        }
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
                        const najie = JSON.parse(najieData);
                        const najieWithId = {
                            userId,
                            ...najie
                        };
                        najieList.push(najieWithId);
                    }
                    catch (error) {
                        logger.error(`解析背包数据失败 ${userId}:`, error);
                        const corruptedNajie = {
                            userId,
                            灵石: 0,
                            装备: [],
                            丹药: [],
                            道具: [],
                            功法: [],
                            草药: [],
                            材料: [],
                            仙宠: [],
                            仙宠口粮: [],
                            数据状态: 'corrupted',
                            原始数据: najieData,
                            错误信息: error.message
                        };
                        najieList.push(corruptedNajie);
                        total++;
                    }
                }
            }
        }
        if (stats) {
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
            for (const key of allKeys) {
                const userId = key.replace(`${__PATH.najie_path}:`, '');
                const najieData = await redis.get(key);
                if (najieData) {
                    try {
                        const najie = JSON.parse(najieData);
                        const matchesSearch = !search || userId.includes(search);
                        if (matchesSearch) {
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
                        logger.error(`解析背包数据失败 ${userId}:`, error);
                    }
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
            return;
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
        logger.error('获取背包列表错误:', error);
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
        const najieData = await redis.get(keys.najie(userId));
        if (!najieData) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '背包不存在',
                data: null
            };
            return;
        }
        const najie = JSON.parse(najieData);
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
        logger.error('获取背包详情错误:', error);
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
        const { userId, 灵石, 灵石上限, 等级, 装备, 丹药, 道具, 功法, 草药, 材料, 仙宠, 仙宠口粮 } = body;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        const najieData = {
            灵石: 灵石 || 0,
            灵石上限: 灵石上限 || 0,
            等级: 等级 || 1,
            装备: Array.isArray(装备) ? 装备 : [],
            丹药: Array.isArray(丹药) ? 丹药 : [],
            道具: Array.isArray(道具) ? 道具 : [],
            功法: Array.isArray(功法) ? 功法 : [],
            草药: Array.isArray(草药) ? 草药 : [],
            材料: Array.isArray(材料) ? 材料 : [],
            仙宠: Array.isArray(仙宠) ? 仙宠 : [],
            仙宠口粮: Array.isArray(仙宠口粮) ? 仙宠口粮 : []
        };
        await redis.set(keys.najie(userId), JSON.stringify(najieData));
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '背包更新成功',
            data: {
                userId,
                ...najieData
            }
        };
    }
    catch (error) {
        logger.error('更新背包数据错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
