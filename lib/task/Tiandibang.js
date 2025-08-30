import { writeTiandibang } from '../model/tian.js';
import { keysByPath, __PATH, keys } from '../model/keys.js';
import { getDataList } from '../model/DataList.js';
import { getDataJSONParseByKey } from '../model/DataControl.js';

const calculatePowerScore = (player) => {
    const baseScore = player.攻击 * 0.3 + player.防御 * 0.2 + player.血量上限 * 0.1;
    const critBonus = player.暴击率 * 1000;
    const magicBonus = (player.魔道值 || 0) * 0.1;
    const stoneBonus = (player.神石 || 0) * 0.05;
    return Math.floor(baseScore + critBonus + magicBonus + stoneBonus);
};
const getLevelInfo = (levelId, levelList) => {
    return levelList.find(item => item.level_id === levelId) || null;
};
const createRankEntry = (player, levelId, userId) => {
    const powerScore = calculatePowerScore(player);
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
        积分: powerScore
    };
};
const bubbleSortByScore = (arr) => {
    const len = arr.length;
    let swapped;
    for (let i = 0; i < len - 1; i++) {
        swapped = false;
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j].积分 < arr[j + 1].积分) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
};
const TiandibangTask = async () => {
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
                const player = await getDataJSONParseByKey(keys.player(userId));
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
        bubbleSortByScore(rankEntries);
        await writeTiandibang(rankEntries);
        return true;
    }
    catch (error) {
        logger.error('天帝榜任务执行失败:', error);
        return false;
    }
};

export { TiandibangTask };
