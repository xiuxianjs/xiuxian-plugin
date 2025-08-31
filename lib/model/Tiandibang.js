import { writeTiandibang } from './tian.js';
import { keysByPath, __PATH, keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey } from './DataControl.js';

const getLevelInfo = (levelId, levelList) => {
    return levelList.find(item => item.level_id === levelId) || null;
};
const createRankEntry = (player, levelId, userId) => {
    return {
        名号: player.名号,
        境界: levelId,
        攻击: player.攻击,
        防御: player.防御,
        当前血量: player.血量上限,
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根.法球倍率 || 1,
        学习的功法: player.学习的功法 || [],
        魔道值: player.魔道值 || 0,
        神石: player.神石 || 0,
        qq: userId,
        次数: 3,
        积分: 0
    };
};
const reSetTiandibang = async () => {
    try {
        const playerList = await keysByPath(__PATH.player_path);
        if (!playerList || playerList.length === 0) {
            return false;
        }
        const levelList = await getDataList('Level1');
        if (!levelList || levelList.length === 0) {
            return false;
        }
        const rankEntries = [];
        await Promise.all(playerList.map(async (userId) => {
            try {
                const player = (await getDataJSONParseByKey(keys.player(userId)));
                if (!player) {
                    logger.warn(`玩家数据不存在: ${userId}`);
                    return;
                }
                const levelInfo = getLevelInfo(player.level_id, levelList);
                if (!levelInfo) {
                    logger.warn(`玩家 ${player.名号} 的境界信息不存在: level_id=${player.level_id}`);
                    return;
                }
                const rankEntry = createRankEntry(player, levelInfo.level_id, userId);
                rankEntries.push(rankEntry);
            }
            catch (error) {
                logger.error(`处理玩家 ${userId} 数据时出错:`, error);
            }
        }));
        if (rankEntries.length === 0) {
            logger.warn('没有有效的排行榜数据');
            return false;
        }
        await writeTiandibang(rankEntries);
        logger.info(`天地榜重置完成，共处理 ${rankEntries.length} 个玩家`);
        return true;
    }
    catch (error) {
        logger.error('天地榜重置任务执行失败:', error);
        return false;
    }
};

export { createRankEntry, reSetTiandibang };
