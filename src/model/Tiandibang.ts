import { writeTiandibang } from '@src/model/tian';
import { __PATH, keys, keysByPath } from '@src/model/keys';
import type { TiandibangRankEntry as RankEntry } from '@src/types';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import type { Player } from '@src/types/player';

/**
 * 获取玩家境界信息
 * @param levelId 境界ID
 * @param levelList 境界列表
 * @returns 境界信息或null
 */
const getLevelInfo = (levelId: number, levelList: any[]): any => {
  return levelList.find(item => item.level_id === levelId) || null;
};

/**
 * 创建排行榜条目 - 重置积分和次数
 * @param player 玩家数据
 * @param levelId 境界ID
 * @param userId 用户ID
 * @returns 排行榜条目
 */
export const createRankEntry = (player: Player, levelId: number, userId: string): RankEntry => {
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
    次数: 3, // 重置为3次
    积分: 0 // 重置为0
  };
};

/**
 * 天地榜重置任务 - 重置所有玩家积分和次数
 * 定时执行，将所有玩家积分重置为0，次数重置为3次
 */
export const reSetTiandibang = async (): Promise<boolean> => {
  try {
    // 获取所有玩家ID
    const playerList = await keysByPath(__PATH.player_path);

    if (!playerList || playerList.length === 0) {
      return false;
    }

    // 获取境界列表（只获取一次）
    const levelList = await getDataList('Level1');

    if (!levelList || levelList.length === 0) {
      return false;
    }

    // 并行处理所有玩家数据
    const rankEntries: RankEntry[] = [];

    await Promise.all(
      playerList.map(async (userId: string) => {
        try {
          const player = (await getDataJSONParseByKey(keys.player(userId))) as Player;

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
        } catch (error) {
          logger.error(`处理玩家 ${userId} 数据时出错:`, error);
        }
      })
    );

    // 检查是否有有效数据
    if (rankEntries.length === 0) {
      logger.warn('没有有效的排行榜数据');

      return false;
    }

    // 写入排行榜数据
    await writeTiandibang(rankEntries);

    logger.info(`天地榜重置完成，共处理 ${rankEntries.length} 个玩家`);

    return true;
  } catch (error) {
    logger.error('天地榜重置任务执行失败:', error);

    return false;
  }
};
