import { validateRole } from '../core/auth.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { getIoRedis } from '@alemonjs/db';
import { __PATH } from '../../model/keys.js';

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
        const players = [];
        let total = 0;
        const scanPattern = `${__PATH.player_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        if (search) {
            for (const key of allKeys) {
                const userId = key.replace(`${__PATH.player_path}:`, '');
                const playerData = await redis.get(key);
                if (playerData) {
                    try {
                        const player = JSON.parse(playerData);
                        const playerWithId = {
                            id: userId,
                            ...player
                        };
                        const matchesSearch = !search ||
                            playerWithId.名号?.toLowerCase().includes(search.toLowerCase()) ||
                            playerWithId.id.includes(search);
                        if (matchesSearch) {
                            total++;
                            const startIndex = (page - 1) * pageSize;
                            if (players.length < pageSize && total > startIndex) {
                                players.push(playerWithId);
                            }
                        }
                    }
                    catch (error) {
                        logger.error(`解析玩家数据失败 ${userId}:`, error);
                        const corruptedPlayer = {
                            id: userId,
                            名号: `[数据损坏] ${userId}`,
                            sex: '',
                            宣言: '',
                            avatar: '',
                            level_id: 0,
                            Physique_id: 0,
                            race: 0,
                            修为: 0,
                            血气: 0,
                            灵石: 0,
                            灵根: null,
                            神石: 0,
                            favorability: 0,
                            breakthrough: false,
                            linggen: [],
                            linggenshow: 0,
                            学习的功法: [],
                            修炼效率提升: 0,
                            连续签到天数: 0,
                            攻击加成: 0,
                            防御加成: 0,
                            生命加成: 0,
                            power_place: 0,
                            当前血量: 0,
                            lunhui: 0,
                            lunhuiBH: 0,
                            轮回点: 0,
                            occupation: [],
                            occupation_level: 0,
                            镇妖塔层数: 0,
                            神魄段数: 0,
                            魔道值: 0,
                            仙宠: [],
                            练气皮肤: 0,
                            装备皮肤: 0,
                            幸运: 0,
                            addluckyNo: 0,
                            师徒任务阶段: 0,
                            师徒积分: 0,
                            攻击: 0,
                            防御: 0,
                            血量上限: 0,
                            暴击率: 0,
                            暴击伤害: 0,
                            数据状态: 'corrupted',
                            原始数据: playerData,
                            错误信息: error.message
                        };
                        const matchesSearch = !search ||
                            corruptedPlayer.名号
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            corruptedPlayer.id.includes(search);
                        if (matchesSearch) {
                            total++;
                            const startIndex = (page - 1) * pageSize;
                            if (players.length < pageSize && total > startIndex) {
                                players.push(corruptedPlayer);
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
                const userId = key.replace(`${__PATH.player_path}:`, '');
                const playerData = await redis.get(key);
                if (playerData) {
                    try {
                        const player = JSON.parse(playerData);
                        const playerWithId = {
                            id: userId,
                            ...player
                        };
                        players.push(playerWithId);
                    }
                    catch (error) {
                        logger.error(`解析玩家数据失败 ${userId}:`, error);
                        const corruptedPlayer = {
                            id: userId,
                            名号: `[数据损坏] ${userId}`,
                            sex: '',
                            宣言: '',
                            avatar: '',
                            level_id: 0,
                            Physique_id: 0,
                            race: 0,
                            修为: 0,
                            血气: 0,
                            灵石: 0,
                            灵根: null,
                            神石: 0,
                            favorability: 0,
                            breakthrough: false,
                            linggen: [],
                            linggenshow: 0,
                            学习的功法: [],
                            修炼效率提升: 0,
                            连续签到天数: 0,
                            攻击加成: 0,
                            防御加成: 0,
                            生命加成: 0,
                            power_place: 0,
                            当前血量: 0,
                            lunhui: 0,
                            lunhuiBH: 0,
                            轮回点: 0,
                            occupation: [],
                            occupation_level: 0,
                            镇妖塔层数: 0,
                            神魄段数: 0,
                            魔道值: 0,
                            仙宠: [],
                            练气皮肤: 0,
                            装备皮肤: 0,
                            幸运: 0,
                            addluckyNo: 0,
                            师徒任务阶段: 0,
                            师徒积分: 0,
                            攻击: 0,
                            防御: 0,
                            血量上限: 0,
                            暴击率: 0,
                            暴击伤害: 0,
                            数据状态: 'corrupted',
                            原始数据: playerData,
                            错误信息: error.message
                        };
                        players.push(corruptedPlayer);
                        total++;
                    }
                }
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取游戏用户列表成功',
            data: {
                list: players,
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
        logger.error('获取游戏用户列表错误:', error);
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
        const playerData = await redis.get(`${__PATH.player_path}:${userId}`);
        if (!playerData) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在',
                data: null
            };
            return;
        }
        const player = JSON.parse(playerData);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取游戏用户数据成功',
            data: {
                id: userId,
                ...player
            }
        };
    }
    catch (error) {
        logger.error('获取游戏用户数据错误:', error);
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
        const search = ctx.request.query.search || '';
        const scanPattern = `${__PATH.player_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        let total = 0;
        let highLevel = 0;
        let mediumLevel = 0;
        let lowLevel = 0;
        let totalLingshi = 0;
        let totalShenshi = 0;
        let totalLunhui = 0;
        if (search) {
            for (const key of allKeys) {
                const userId = key.replace(`${__PATH.player_path}:`, '');
                const playerData = await redis.get(key);
                if (playerData) {
                    try {
                        const player = JSON.parse(playerData);
                        const playerWithId = {
                            id: userId,
                            ...player
                        };
                        const matchesSearch = !search ||
                            playerWithId.名号?.toLowerCase().includes(search.toLowerCase()) ||
                            playerWithId.id.includes(search);
                        if (matchesSearch) {
                            total++;
                            if (playerWithId.level_id > 30) {
                                highLevel++;
                            }
                            else if (playerWithId.level_id > 10) {
                                mediumLevel++;
                            }
                            else {
                                lowLevel++;
                            }
                            totalLingshi += playerWithId.灵石 || 0;
                            totalShenshi += playerWithId.神石 || 0;
                            totalLunhui += playerWithId.lunhui || 0;
                        }
                    }
                    catch (error) {
                        logger.error(`解析玩家数据失败 ${userId}:`, error);
                        const matchesSearch = !search || userId.includes(search);
                        if (matchesSearch) {
                            total++;
                            lowLevel++;
                        }
                    }
                }
            }
        }
        else {
            total = allKeys.length;
            const sampleKeys = allKeys.slice(0, Math.min(100, allKeys.length));
            for (const key of sampleKeys) {
                const userId = key.replace(`${__PATH.player_path}:`, '');
                const playerData = await redis.get(key);
                if (playerData) {
                    try {
                        const player = JSON.parse(playerData);
                        const playerWithId = {
                            id: userId,
                            ...player
                        };
                        if (playerWithId.level_id > 30) {
                            highLevel++;
                        }
                        else if (playerWithId.level_id > 10) {
                            mediumLevel++;
                        }
                        else {
                            lowLevel++;
                        }
                        totalLingshi += playerWithId.灵石 || 0;
                        totalShenshi += playerWithId.神石 || 0;
                        totalLunhui += playerWithId.lunhui || 0;
                    }
                    catch (error) {
                        logger.error(`解析玩家数据失败 ${userId}:`, error);
                        total++;
                        lowLevel++;
                    }
                }
            }
            if (sampleKeys.length > 0) {
                const ratio = allKeys.length / sampleKeys.length;
                highLevel = Math.round(highLevel * ratio);
                mediumLevel = Math.round(mediumLevel * ratio);
                lowLevel = Math.round(lowLevel * ratio);
                totalLingshi = Math.round(totalLingshi * ratio);
                totalShenshi = Math.round(totalShenshi * ratio);
                totalLunhui = Math.round(totalLunhui * ratio);
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取统计信息成功',
            data: {
                total,
                highLevel,
                mediumLevel,
                lowLevel,
                totalLingshi,
                totalShenshi,
                totalLunhui
            }
        };
    }
    catch (error) {
        logger.error('获取统计信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
