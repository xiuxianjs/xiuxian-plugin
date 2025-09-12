import { redis } from '@src/model/api';
import { getPushInfo } from '@src/model/common';
import { delDataByKey, readPlayer, setDataJSONStringifyByKey } from '@src/model';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { addExp2, addExp } from '@src/model/economy';
import { __PATH, keys as dataKeys, keysAction } from '@src/model/keys';
import type { ActionRecord } from '@src/types';
import type { Player } from '@src/types/player';
import { pushMessage } from '../MessageSystem';
import { Text } from 'alemonjs';

interface MojieItem {
  name: string;
  class: string;
}

interface MojieData {
  one: MojieItem[];
  two: MojieItem[];
  three: MojieItem[];
}

interface ExplorationResult {
  thingName: string;
  thingClass: string;
  message: string;
  quantity: number;
  t1: number;
  t2: number;
}

interface LuckyBonus {
  message: string;
  quantity: number;
}

interface SettlementResult {
  xiuwei: number;
  qixue: number;
  message: string;
}

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  FIND_ITEM_CHANCE: 0.98,
  RARE_ITEM_CHANCE: 0.4,
  EPIC_ITEM_CHANCE: 0.15,
  XIUWEI_BASE: 2000,
  QIXUE_BASE: 2000,
  LEVEL_MULTIPLIER: 100,
  PHYSIQUE_MULTIPLIER: 100,
  XIUWEI_DIVISOR: 5,
  XIUWEI_MULTIPLIER: 0.1,
  QIXUE_MULTIPLIER: 0.1
} as const;

/**
 * 道具效果配置
 */
const ITEM_EFFECTS = {
  XIUMO_DAN_MULTIPLIER: 100,
  XUEMO_DAN_MULTIPLIER: 18
} as const;

/**
 * 检查是否为探索动作
 * @param action 动作对象
 * @returns 是否为探索动作
 */
function isExploreAction(action: any): action is ActionRecord {
  return !!action && typeof action === 'object' && 'end_time' in action;
}

/**
 * 解析时间参数
 * @param time 时间参数
 * @returns 时间数值
 */
const parseTime = (time: number | string | undefined): number => {
  if (!time) {
    return 0;
  }
  const baseDuration = typeof time === 'number' ? time : parseInt(String(time || 0), 10);

  return isNaN(baseDuration) ? 0 : baseDuration;
};

/**
 * 获取随机物品
 * @param mojieData 魔劫数据
 * @returns 探索结果
 */
const getRandomItem = (mojieData: MojieData): ExplorationResult => {
  const random1 = Math.random();
  const random2 = Math.random();
  const random3 = Math.random();

  if (random1 <= BASE_CONFIG.FIND_ITEM_CHANCE) {
    if (random2 <= BASE_CONFIG.RARE_ITEM_CHANCE) {
      if (random3 <= BASE_CONFIG.EPIC_ITEM_CHANCE && mojieData.three.length > 0) {
        const random4 = Math.floor(Math.random() * mojieData.three.length);
        const item = mojieData.three[random4];

        return {
          thingName: item.name,
          thingClass: item.class,
          message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${item.name}]`,
          quantity: 1,
          t1: 2 + Math.random(),
          t2: 2 + Math.random()
        };
      } else if (mojieData.two.length > 0) {
        const random4 = Math.floor(Math.random() * mojieData.two.length);
        const item = mojieData.two[random4];

        return {
          thingName: item.name,
          thingClass: item.class,
          message: `在洞穴中拿到[${item.name}]`,
          quantity: 1,
          t1: 1 + Math.random(),
          t2: 1 + Math.random()
        };
      }
    } else if (mojieData.one.length > 0) {
      const random4 = Math.floor(Math.random() * mojieData.one.length);
      const item = mojieData.one[random4];

      return {
        thingName: item.name,
        thingClass: item.class,
        message: `捡到了[${item.name}]`,
        quantity: 1,
        t1: 0.5 + Math.random() * 0.5,
        t2: 0.5 + Math.random() * 0.5
      };
    }
  }

  return {
    thingName: '',
    thingClass: '',
    message: '走在路上都没看见一只蚂蚁！',
    quantity: 1,
    t1: 2 + Math.random(),
    t2: 2 + Math.random()
  };
};

/**
 * 检查幸运加成
 * @param player 玩家数据
 * @returns 幸运加成信息
 */
const checkLuckyBonus = (player: Player): LuckyBonus => {
  const random = Math.random();

  if (random < player.幸运) {
    let message = '';

    if (random < player.addluckyNo) {
      message = '福源丹生效，所以在';
    } else if (player.仙宠?.type === '幸运') {
      message = '仙宠使你在探索中欧气满满，所以在';
    }

    message += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';

    return {
      message,
      quantity: 2
    };
  }

  return {
    message: '',
    quantity: 1
  };
};

/**
 * 处理福源丹效果
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @returns 福源丹消息
 */
const handleLuckyPill = async (playerId: string, player: Player): Promise<string> => {
  if ((player.islucky || 0) <= 0) {
    return '';
  }

  player.islucky--;
  let message = '';

  if (player.islucky !== 0) {
    message = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
  } else {
    message = '  \n本次探索后，福源丹已失效\n';
    player.幸运 -= player.addluckyNo;
    player.addluckyNo = 0;
  }

  await redis.set(dataKeys.player(playerId), JSON.stringify(player));

  return message;
};

/**
 * 计算结算奖励
 * @param player 玩家数据
 * @param t1 修为系数
 * @param t2 气血系数
 * @returns 结算结果
 */
const calculateRewards = (player: Player, t1: number, t2: number): SettlementResult => {
  const levelId = player.level_id || 0;
  const physiqueId = player.Physique_id || 0;

  const xiuwei = Math.trunc(
    BASE_CONFIG.XIUWEI_BASE + (BASE_CONFIG.LEVEL_MULTIPLIER * levelId * levelId * t1 * BASE_CONFIG.XIUWEI_MULTIPLIER) / BASE_CONFIG.XIUWEI_DIVISOR
  );
  const qixue = Math.trunc(BASE_CONFIG.QIXUE_BASE + BASE_CONFIG.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * BASE_CONFIG.QIXUE_MULTIPLIER);

  return { xiuwei, qixue, message: '' };
};

/**
 * 处理道具效果
 * @param playerId 玩家ID
 * @param xiuwei 修为
 * @param qixue 气血
 * @returns 处理后的奖励
 */
const handleItemEffects = async (playerId: string, xiuwei: number, qixue: number): Promise<{ xiuwei: number; qixue: number }> => {
  let finalXiuwei = xiuwei;
  let finalQixue = qixue;

  if (await existNajieThing(playerId, '修魔丹', '道具')) {
    finalXiuwei *= ITEM_EFFECTS.XIUMO_DAN_MULTIPLIER;
    finalXiuwei = Math.trunc(finalXiuwei);
    await addNajieThing(playerId, '修魔丹', '道具', -1);
  }

  if (await existNajieThing(playerId, '血魔丹', '道具')) {
    finalQixue *= ITEM_EFFECTS.XUEMO_DAN_MULTIPLIER;
    finalQixue = Math.trunc(finalQixue);
    await addNajieThing(playerId, '血魔丹', '道具', -1);
  }

  return { xiuwei: finalXiuwei, qixue: finalQixue };
};

/**
 * 处理探索完成
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param result 探索结果
 * @param luckyMessage 幸运消息
 * @param fydMessage 福源丹消息
 * @param pushAddress 推送地址
 * @param isGroup 是否群组
 * @param remainingCount 剩余次数
 */
const handleExplorationComplete = async (
  playerId: string,
  action: ActionRecord,
  result: SettlementResult,
  luckyMessage: string,
  fydMessage: string,
  pushAddress: string,
  isGroup: boolean,
  remainingCount: number
): Promise<void> => {
  const msg: string[] = [];
  const lastMessage = `${result.message}，获得[修为${result.xiuwei > 100000 ? (result.xiuwei / 10000).toFixed(1) + "万" : result.xiuwei}万]，获得[气血${result.qixue > 100000 ? (result.qixue / 10000).toFixed(1) + "万" : result.qixue}]，剩余次数${remainingCount}`;

  msg.push('\n' + luckyMessage + lastMessage + fydMessage);

  const arr: ActionRecord = { ...action };

  if (arr.cishu === 1) {
    // 探索完成，关闭所有状态
    void delDataByKey(keysAction.action(playerId));

    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void pushMessage(
      {
        uid: playerId,
        cid: isGroup && pushAddress ? pushAddress : ''
      },
      [Text(msg.join(''))]
    );
  } else {
    // 继续探索
    if (typeof arr.cishu === 'number') {
      arr.cishu--;
    }

    await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void pushMessage(
      {
        uid: playerId,
        cid: isGroup && pushAddress ? pushAddress : ''
      },
      [Text(msg.join(''))]
    );
  }
};

/**
 * 处理单个玩家的魔劫探索
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param mojieData 魔劫数据
 * @returns 是否处理成功
 */
const processPlayerExploration = async (playerId: string, action: ActionRecord, mojieData: MojieData): Promise<boolean> => {
  try {
    const baseDuration = parseTime(action.time);
    const endTime = action.end_time - baseDuration;
    const nowTime = Date.now();

    if (nowTime <= endTime) {
      return false;
    }

    const player = await readPlayer(playerId);

    if (!player) {
      return false;
    }
    const { pushAddress, isGroup } = getPushInfo(action, playerId);

    // 获取随机物品
    const explorationResult = getRandomItem(mojieData);

    // 检查幸运加成
    const luckyBonus = checkLuckyBonus(player);
    const finalQuantity = explorationResult.quantity * luckyBonus.quantity;

    // 处理福源丹效果
    const fydMessage = await handleLuckyPill(playerId, player);

    // 计算奖励
    const settlementResult = calculateRewards(player, explorationResult.t1, explorationResult.t2);

    // 处理道具效果
    const { xiuwei, qixue } = await handleItemEffects(playerId, settlementResult.xiuwei, settlementResult.qixue);

    // 添加物品奖励
    if (explorationResult.thingName && explorationResult.thingClass) {
      await addNajieThing(playerId, explorationResult.thingName, explorationResult.thingClass, finalQuantity);
    }

    const finalResult: SettlementResult = {
      xiuwei,
      qixue,
      message: explorationResult.message
    };

    // 处理探索完成
    await handleExplorationComplete(playerId, action, finalResult, luckyBonus.message, fydMessage, pushAddress, isGroup, (action.cishu ?? 0) - 1);

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 *
 * @param playerId
 * @param action
 * @returns
 * @description mojie 为 0 时，进行探索
 */
export const handelAction = async (playerId: string, action, { mojieDataList }) => {
  try {
    if (!mojieDataList || mojieDataList.length === 0) {
      return;
    }

    const mojieData = mojieDataList[0] as MojieData;

    if (!action || !isExploreAction(action)) {
      return;
    }

    if (String(action.mojie) === '0') {
      await processPlayerExploration(playerId, action, mojieData);
    }
  } catch (error) {
    logger.error(error);
  }
};
