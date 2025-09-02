import { notUndAndNull } from '@src/model/common';
import { delDataByKey, readPlayer, setDataJSONStringifyByKey } from '@src/model';
import { writePlayer } from '@src/model';
import { addNajieThing } from '@src/model/najie';
import { addExp2, addExp } from '@src/model/economy';
import { __PATH, keysAction } from '@src/model/keys';
import { DataMention, Mention, Text } from 'alemonjs';
import type { CoreNajieCategory as NajieCategory, ActionState, ShenjiePlace } from '@src/types';
import { NAJIE_CATEGORIES } from '@src/model/settions';
import type { Player } from '@src/types/player';
import { setMessage } from '../MessageSystem';

function isNajieCategory(v: any): v is NajieCategory {
  return typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v);
}

interface RewardItem {
  name: string;
  class: NajieCategory;
}

interface ExplorationResult {
  message: string;
  thingName?: string;
  thingClass?: NajieCategory;
  quantity: number;
  xiuwei: number;
  qixue: number;
}

interface LuckyBonus {
  message: string;
  quantity: number;
}

/**
 * 神界探索概率配置
 */
const EXPLORATION_PROBABILITIES = {
  FIND_ITEM: 0.98,
  RARE_ITEM: 0.4,
  EPIC_ITEM: 0.15
} as const;

/**
 * 基础奖励配置
 */
const BASE_REWARDS = {
  XIUWEI_BASE: 2000,
  QIXUE_BASE: 2000,
  LEVEL_MULTIPLIER: 100,
  PHYSIQUE_MULTIPLIER: 100
} as const;

/**
 * 获取随机物品
 * @param place 神界地点
 * @param random1 随机数1
 * @param random2 随机数2
 * @param random3 随机数3
 * @returns 物品信息和消息
 */
const getRandomItem = (
  place: ShenjiePlace,
  random1: number,
  random2: number,
  random3: number
): { item?: RewardItem; message: string; t1: number; t2: number } => {
  if (random1 <= EXPLORATION_PROBABILITIES.FIND_ITEM) {
    if (random2 <= EXPLORATION_PROBABILITIES.RARE_ITEM) {
      if (random3 <= EXPLORATION_PROBABILITIES.EPIC_ITEM && place.three.length > 0) {
        const idx = Math.floor(Math.random() * place.three.length);
        const item = place.three[idx];

        return {
          item: {
            name: item.name,
            class: isNajieCategory(item.class) ? item.class : '道具'
          },
          message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${item.name}]`,
          t1: 2 + Math.random(),
          t2: 2 + Math.random()
        };
      } else if (place.two.length > 0) {
        const idx = Math.floor(Math.random() * place.two.length);
        const item = place.two[idx];

        return {
          item: {
            name: item.name,
            class: isNajieCategory(item.class) ? item.class : '道具'
          },
          message: `在洞穴中拿到[${item.name}]`,
          t1: 1 + Math.random(),
          t2: 1 + Math.random()
        };
      }
    } else if (place.one.length > 0) {
      const idx = Math.floor(Math.random() * place.one.length);
      const item = place.one[idx];

      return {
        item: {
          name: item.name,
          class: isNajieCategory(item.class) ? item.class : '道具'
        },
        message: `捡到了[${item.name}]`,
        t1: 0.5 + Math.random() * 0.5,
        t2: 0.5 + Math.random() * 0.5
      };
    }
  }

  return {
    message: '走在路上都没看见一只蚂蚁！',
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
  const lucky = Number(player.幸运) || 0;
  const addLucky = Number(player.addluckyNo) || 0;

  if (random < lucky) {
    let message = '';

    if (random < addLucky) {
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
    player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
    player.addluckyNo = 0;
  }

  await writePlayer(playerId, player);

  return message;
};

/**
 * 计算探索奖励
 * @param player 玩家数据
 * @param t1 修为系数
 * @param t2 气血系数
 * @returns 奖励数值
 */
const calculateRewards = (player: Player, t1: number, t2: number): { xiuwei: number; qixue: number } => {
  const levelId = player.level_id ?? 0;
  const physiqueId = player.Physique_id ?? 0;

  const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
  const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);

  return { xiuwei, qixue };
};

/**
 * 处理探索完成
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @param action 动作状态
 * @param result 探索结果
 * @param luckyMessage 幸运消息
 * @param fydMessage 福源丹消息
 * @param pushAddress 推送地址
 * @param isGroup 是否群聊
 */
const handleExplorationComplete = async (
  playerId: string,
  player: Player,
  action: ActionState,
  result: ExplorationResult,
  luckyMessage: string,
  fydMessage: string,
  pushAddress?: string,
  isGroup = false
): Promise<void> => {
  const msg: Array<DataMention | string> = [Mention(playerId)];
  const lastMessage = `${result.message},获得修为${result.xiuwei},气血${result.qixue},剩余次数${(Number(action.cishu) || 0) - 1}`;

  msg.push('\n' + player.名号 + luckyMessage + lastMessage + fydMessage);

  const arr: ActionState = action;
  const remain = Number(arr.cishu) || 0;

  if (remain <= 1) {
    // 探索完成，关闭所有状态
    void delDataByKey(keysAction.action(playerId));

    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void setMessage({
      id: '',
      uid: playerId,
      cid: isGroup && pushAddress ? pushAddress : '',
      data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
    });
  } else {
    // 继续探索
    arr.cishu = remain - 1;
    await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void setMessage({
      id: '',
      uid: playerId,
      cid: isGroup && pushAddress ? pushAddress : '',
      data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
    });
  }
};

/**
 * 处理单个玩家的神界探索
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param shenjieData 神界数据
 * @returns 是否处理成功
 */
const processPlayerExploration = async (playerId: string, action: ActionState, place: ShenjiePlace): Promise<boolean> => {
  try {
    let pushAddress: string | undefined;
    let isGroup = false;

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = String(action.group_id);
    }

    let endTime = Number(action.end_time) || 0;
    const nowTime = Date.now();
    const player = await readPlayer(playerId);

    if (!player) {
      return false;
    }

    if (String(action.mojie) === '-1') {
      endTime = endTime - Number(action.time ?? 0);

      if (nowTime > endTime) {
        if (!place) {
          return false;
        }

        // 获取随机物品
        const random1 = Math.random();
        const random2 = Math.random();
        const random3 = Math.random();
        const { item, message, t1, t2 } = getRandomItem(place, random1, random2, random3);

        // 检查幸运加成
        const luckyBonus = checkLuckyBonus(player);

        // 处理福源丹效果
        const fydMessage = await handleLuckyPill(playerId, player);

        // 计算奖励
        const { xiuwei, qixue } = calculateRewards(player, t1, t2);

        // 添加物品奖励
        if (item) {
          await addNajieThing(playerId, item.name, item.class, luckyBonus.quantity);
        }

        const result: ExplorationResult = {
          message,
          thingName: item?.name,
          thingClass: item?.class,
          quantity: luckyBonus.quantity,
          xiuwei,
          qixue
        };

        // 处理探索完成
        await handleExplorationComplete(playerId, player, action, result, luckyBonus.message, fydMessage, pushAddress, isGroup);

        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 神界任务 - 处理玩家神界探索
 * 遍历所有玩家，检查处于神界探索状态的玩家，进行结算处理
 * @description mojie 为 -1 时，进行探索
 */
export const handelAction = async (playerId: string, action: ActionState, { shenjieData }): Promise<void> => {
  try {
    if (!shenjieData || shenjieData.length === 0) {
      return;
    }

    const place = shenjieData?.[0];

    await processPlayerExploration(playerId, action, place);
  } catch (error) {
    logger.error(error);
  }
};
