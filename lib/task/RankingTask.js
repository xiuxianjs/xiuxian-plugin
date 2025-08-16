import { getIoRedis } from '@alemonjs/db';
import { __PATH } from '../model/paths.js';

const redis = getIoRedis();
const RANKING_KEYS = {
    ASSOCIATION_POWER: 'ranking:association:power',
    ASSOCIATION_MEMBERS: 'ranking:association:members',
    ASSOCIATION_LINGSHI: 'ranking:association:lingshi',
    ASSOCIATION_LEVEL: 'ranking:association:level',
    PLAYER_LEVEL: 'ranking:player:level',
    PLAYER_LINGSHI: 'ranking:player:lingshi',
    PLAYER_ATTACK: 'ranking:player:attack',
    PLAYER_DEFENSE: 'ranking:player:defense'
};
async function calculateAssociationRankings() {
    try {
        console.log('开始计算宗门排名...');
        const scanPattern = `${__PATH.association}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        const associations = [];
        for (const key of allKeys) {
            const associationName = key.replace(`${__PATH.association}:`, '');
            const associationData = await redis.get(key);
            if (associationData) {
                try {
                    const association = JSON.parse(decodeURIComponent(associationData));
                    const power = association.power || 0;
                    const memberCount = association.所有成员?.length || 0;
                    const lingshi = association.灵石池 || 0;
                    const level = association.宗门等级 || 1;
                    associations.push({
                        id: associationName,
                        name: association.宗门名称 || associationName,
                        value: power * 1000 + memberCount * 100 + level * 10 + lingshi / 10000,
                        rank: 0,
                        extra: {
                            宗主: association.宗主 || '',
                            成员数: memberCount,
                            宗门等级: level,
                            灵石池: lingshi,
                            power: power
                        }
                    });
                }
                catch (error) {
                    console.error(`解析宗门数据失败 ${associationName}:`, error);
                }
            }
        }
        associations.sort((a, b) => b.value - a.value);
        associations.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.ASSOCIATION_POWER, 3600, JSON.stringify(associations));
        const memberRanking = [...associations].sort((a, b) => b.extra.成员数 - a.extra.成员数);
        memberRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.ASSOCIATION_MEMBERS, 3600, JSON.stringify(memberRanking));
        const lingshiRanking = [...associations].sort((a, b) => b.extra.灵石池 - a.extra.灵石池);
        lingshiRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.ASSOCIATION_LINGSHI, 3600, JSON.stringify(lingshiRanking));
        const levelRanking = [...associations].sort((a, b) => b.extra.宗门等级 - a.extra.宗门等级);
        levelRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.ASSOCIATION_LEVEL, 3600, JSON.stringify(levelRanking));
        console.log(`宗门排名计算完成，共处理 ${associations.length} 个宗门`);
    }
    catch (error) {
        console.error('计算宗门排名失败:', error);
    }
}
async function calculatePlayerRankings() {
    try {
        console.log('开始计算玩家排名...');
        const scanPattern = `${__PATH.player_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        const players = [];
        for (const key of allKeys) {
            const userId = key.replace(`${__PATH.player_path}:`, '');
            const playerData = await redis.get(key);
            if (playerData) {
                try {
                    const player = JSON.parse(decodeURIComponent(playerData));
                    players.push({
                        id: userId,
                        name: player.名号 || userId,
                        value: player.level_id || 1,
                        rank: 0,
                        extra: {
                            名号: player.名号 || userId,
                            境界: getLevelName(player.level_id || 1),
                            宗门: typeof player.宗门 === 'string'
                                ? player.宗门
                                : player.宗门?.宗门名称,
                            攻击: player.攻击 || 0,
                            防御: player.防御 || 0,
                            血量: player.血量上限 || 0
                        }
                    });
                }
                catch (error) {
                    console.error(`解析玩家数据失败 ${userId}:`, error);
                }
            }
        }
        const levelRanking = [...players].sort((a, b) => b.value - a.value);
        levelRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.PLAYER_LEVEL, 3600, JSON.stringify(levelRanking));
        const attackRanking = [...players].sort((a, b) => b.extra.攻击 - a.extra.攻击);
        attackRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.PLAYER_ATTACK, 3600, JSON.stringify(attackRanking));
        const defenseRanking = [...players].sort((a, b) => b.extra.防御 - a.extra.防御);
        defenseRanking.forEach((item, index) => {
            item.rank = index + 1;
        });
        await redis.setex(RANKING_KEYS.PLAYER_DEFENSE, 3600, JSON.stringify(defenseRanking));
        console.log(`玩家排名计算完成，共处理 ${players.length} 个玩家`);
    }
    catch (error) {
        console.error('计算玩家排名失败:', error);
    }
}
function getLevelName(levelId) {
    const levelNames = {
        1: '练气一层',
        2: '练气二层',
        3: '练气三层',
        4: '练气四层',
        5: '练气五层',
        6: '练气六层',
        7: '练气七层',
        8: '练气八层',
        9: '练气九层',
        10: '练气十层',
        11: '筑基初期',
        12: '筑基中期',
        13: '筑基后期',
        14: '筑基大圆满',
        15: '金丹初期',
        16: '金丹中期',
        17: '金丹后期',
        18: '金丹大圆满',
        19: '元婴初期',
        20: '元婴中期',
        21: '元婴后期',
        22: '元婴大圆满',
        23: '化神初期',
        24: '化神中期',
        25: '化神后期',
        26: '化神大圆满',
        27: '炼虚初期',
        28: '炼虚中期',
        29: '炼虚后期',
        30: '炼虚大圆满',
        31: '合体初期',
        32: '合体中期',
        33: '合体后期',
        34: '合体大圆满',
        35: '大乘初期',
        36: '大乘中期',
        37: '大乘后期',
        38: '大乘大圆满',
        39: '渡劫初期',
        40: '渡劫中期',
        41: '渡劫后期',
        42: '渡劫大圆满',
        43: '真仙',
        44: '天仙',
        45: '金仙',
        46: '太乙金仙',
        47: '大罗金仙',
        48: '混元大罗金仙',
        49: '圣人',
        50: '天道圣人',
        51: '大道圣人',
        52: '混沌圣人',
        53: '鸿蒙圣人',
        54: '创世神',
        55: '主宰',
        56: '至尊',
        57: '大帝',
        58: '天帝',
        59: '神帝',
        60: '仙帝',
        61: '圣帝',
        62: '道帝',
        63: '神王',
        64: '凡人'
    };
    return levelNames[levelId] || `境界${levelId}`;
}
async function getRankingData(type, limit = 10) {
    try {
        const key = RANKING_KEYS[type];
        if (!key) {
            throw new Error(`未知的排名类型: ${type}`);
        }
        const data = await redis.get(key);
        if (!data) {
            return [];
        }
        const rankings = JSON.parse(data);
        return rankings.slice(0, limit);
    }
    catch (error) {
        console.error(`获取排名数据失败 ${type}:`, error);
        return [];
    }
}
async function runRankingTask() {
    try {
        console.log('开始执行定时排名任务...');
        await Promise.all([
            calculateAssociationRankings(),
            calculatePlayerRankings()
        ]);
        console.log('定时排名任务执行完成');
    }
    catch (error) {
        console.error('定时排名任务执行失败:', error);
    }
}
async function triggerRankingCalculation() {
    await runRankingTask();
}
async function getRankingStats() {
    try {
        const stats = {
            lastUpdate: new Date().toISOString(),
            associationCount: 0,
            playerCount: 0,
            topAssociations: [],
            topPlayers: []
        };
        const associationRanking = await getRankingData('ASSOCIATION_POWER', 5);
        stats.associationCount = associationRanking.length;
        stats.topAssociations = associationRanking;
        const playerRanking = await getRankingData('PLAYER_LEVEL', 5);
        stats.playerCount = playerRanking.length;
        stats.topPlayers = playerRanking;
        return stats;
    }
    catch (error) {
        console.error('获取排名统计失败:', error);
        return null;
    }
}

export { getRankingData, getRankingStats, runRankingTask, triggerRankingCalculation };
