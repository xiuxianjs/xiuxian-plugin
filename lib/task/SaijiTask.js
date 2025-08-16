import { getIoRedis } from '@alemonjs/db';
import { __PATH } from '../model/paths.js';

const redis = getIoRedis();
const SaijiTask = async () => {
    try {
        console.log('开始赛季结算...');
        const seasonKey = 'game:season:current';
        const seasonData = await redis.get(seasonKey);
        if (seasonData) {
            const season = JSON.parse(seasonData);
            const now = new Date();
            if (season.endTime && now >= new Date(season.endTime)) {
                console.log(`开始结算第 ${season.seasonNumber} 赛季`);
                await performSeasonSettlement(season);
                const newSeason = {
                    seasonNumber: season.seasonNumber + 1,
                    startTime: now.toISOString(),
                    endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active'
                };
                await redis.set(seasonKey, JSON.stringify(newSeason));
                const historyKey = `game:season:history:${season.seasonNumber}`;
                await redis.set(historyKey, JSON.stringify(season));
                console.log(`第 ${season.seasonNumber} 赛季结算完成，新赛季 ${newSeason.seasonNumber} 已开始`);
            }
            else {
                console.log('当前赛季尚未结束，无需结算');
            }
        }
        else {
            const initialSeason = {
                seasonNumber: 1,
                startTime: now.toISOString(),
                endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            };
            await redis.set(seasonKey, JSON.stringify(initialSeason));
            console.log('创建初始赛季');
        }
        console.log('赛季结算检查完成');
    }
    catch (error) {
        console.error('赛季结算失败:', error);
    }
};
async function performSeasonSettlement(season) {
    try {
        const scanPattern = `${__PATH.player_path}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        let processedCount = 0;
        let rewardedCount = 0;
        for (const key of allKeys) {
            const userId = key.replace(`${__PATH.player_path}:`, '');
            const playerData = await redis.get(key);
            if (playerData) {
                try {
                    const player = JSON.parse(decodeURIComponent(playerData));
                    const seasonReward = calculateSeasonReward(player, season);
                    if (seasonReward > 0) {
                        player.灵石 = (player.灵石 || 0) + seasonReward;
                        if (!player.赛季奖励) {
                            player.赛季奖励 = [];
                        }
                        player.赛季奖励.push({
                            赛季: season.seasonNumber,
                            奖励: seasonReward,
                            时间: new Date().toISOString()
                        });
                        await redis.set(key, encodeURIComponent(JSON.stringify(player)));
                        rewardedCount++;
                    }
                    processedCount++;
                }
                catch (error) {
                    console.error(`处理玩家赛季结算失败 ${userId}:`, error);
                }
            }
        }
        console.log(`赛季结算完成，处理了 ${processedCount} 个玩家，发放了 ${rewardedCount} 个奖励`);
    }
    catch (error) {
        console.error('执行赛季结算失败:', error);
    }
}
function calculateSeasonReward(player, season) {
    const level = player.level_id || 1;
    const baseReward = level * 1000;
    return baseReward;
}

export { SaijiTask };
