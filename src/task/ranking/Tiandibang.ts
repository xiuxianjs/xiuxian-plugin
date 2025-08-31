import { writeTiandibang } from '@src/model/tian';
import { __PATH, keys, keysByPath, keysLock } from '@src/model/keys';
import type { TiandibangRankEntry as RankEntry } from '@src/types';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import type { Player } from '@src/types/player';
import { withLock } from '@src/model/locks';

/**
 * 计算玩家战力积分
 * @param player 玩家数据
 * @returns 战力积分
 */
const calculatePowerScore = (player: Player): number => {
  const baseScore = player.攻击 * 0.3 + player.防御 * 0.2 + player.血量上限 * 0.1;
  const critBonus = player.暴击率 * 1000; // 暴击率加成
  const magicBonus = (player.魔道值 || 0) * 0.1; // 魔道值加成
  const stoneBonus = (player.神石 || 0) * 0.05; // 神石加成

  return Math.floor(baseScore + critBonus + magicBonus + stoneBonus);
};

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
 * 创建排行榜条目
 * @param player 玩家数据
 * @param levelId 境界ID
 * @param userId 用户ID
 * @returns 排行榜条目
 */
const createRankEntry = (player: Player, levelId: number, userId: string): RankEntry => {
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

/**
 * 冒泡排序优化版 - 按积分降序排列
 * @param arr 待排序数组
 */
const bubbleSortByScore = (arr: RankEntry[]): void => {
  const len = arr.length;
  let swapped: boolean;

  for (let i = 0; i < len - 1; i++) {
    swapped = false;

    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j].积分 < arr[j + 1].积分) {
        // 交换元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果没有发生交换，说明数组已经有序
    if (!swapped) {
      break;
    }
  }
};

/**
 * 天帝榜任务 - 生成玩家排行榜
 * 根据玩家战力计算积分，按积分降序排列
 */
const startTask = async (): Promise<boolean> => {
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

    // 按积分排序
    bubbleSortByScore(rankEntries);

    // 写入排行榜数据
    await writeTiandibang(rankEntries);

    return true;
  } catch (error) {
    logger.error('天帝榜任务执行失败:', error);

    return false;
  }
};

const executeBossBattleWithLock = () => {
  const lockKey = keysLock.task('ForumTask');

  return withLock(
    lockKey,
    async () => {
      await startTask();
    },
    {
      timeout: 1000 * 25, // 25秒超时
      retryDelay: 100, // 100ms重试间隔
      maxRetries: 0, // 不重试
      enableRenewal: true, // 启用锁续期
      renewalInterval: 1000 * 10 // 10秒续期间隔
    }
  );
};

/**
 * 榜单
 */
export const TiandibangTask = () => {
  // 随机 延迟 [60,180] 秒再执行。
  const delay = Math.floor(Math.random() * (180 - 60 + 1)) + 60;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
