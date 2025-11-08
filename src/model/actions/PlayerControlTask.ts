import { getPushInfo, notUndAndNull } from '@src/model/common';
import { delDataByKey, readPlayer, writePlayer, setDataJSONStringifyByKey } from '@src/model';
import { readDanyao, writeDanyao } from '@src/model/danyao';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { addExp, addExp2 } from '@src/model/economy';
import { setFileValue } from '@src/model/cultivation';
import { __PATH, keysAction } from '@src/model/keys';
import { Text } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import type { Player } from '@src/types/player';
import { pushMessage } from '../MessageSystem';
import { ActionRecord } from '@src/types';

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  SETTLEMENT_TIME_OFFSET: 60000 * 2, // 提前2分钟结算
  TIME_CONVERSION: 1000 * 60, // 毫秒转分钟
  MIN_CULTIVATION_TIME: 10 * 60 * 1000, // 最小闭关时间：10分钟（毫秒）
  OPTIMAL_CULTIVATION_TIME: 30 * 60 * 1000, // 最佳闭关时间：30分钟（毫秒）
  MIN_WORK_TIME: 5 * 60 * 1000, // 最小降妖时间：5分钟（毫秒）
  OPTIMAL_WORK_TIME: 15 * 60 * 1000, // 最佳降妖时间：15分钟（毫秒）
  BLOOD_RECOVERY_RATE: 0.02, // 血量恢复比例
  ENLIGHTENMENT_CHANCE: 0.2, // 顿悟概率
  DEMON_CHANCE: 0.8, // 走火入魔概率
  LUCKY_CHANCE: 0.2, // 幸运事件概率
  UNLUCKY_CHANCE: 0.8, // 不幸事件概率
  SPECIAL_CHANCE_MIN: 0.5, // 特殊事件最小概率
  SPECIAL_CHANCE_MAX: 0.6, // 特殊事件最大概率
  // 收益倍率调整 - 用于实现100万/小时收益目标
  CULTIVATION_INCOME_MULTIPLIER: 13, // 闭关收益倍率调整系数
  WORK_INCOME_MULTIPLIER: 8 // 降妖收益倍率调整系数
} as const;

/**
 * 收益曲线配置常量
 */
const INCOME_CURVE_CONFIG = {
  // 闭关收益曲线参数
  CULTIVATION: {
    GROWTH_DECAY_PERIOD: 30, // 增长衰减周期（分钟）
    MAX_EXTRA_GROWTH: 0.5, // 最大额外增长比例（50%）
    GROWTH_DECAY_BASE: 2 // 增长衰减基数
  },
  // 降妖收益曲线参数
  WORK: {
    GROWTH_DECAY_PERIOD: 15, // 增长衰减周期（分钟）
    MAX_EXTRA_GROWTH: 0.3, // 最大额外增长比例（30%）
    GROWTH_DECAY_BASE: 2 // 增长衰减基数
  }
} as const;

/**
 * 奖励系数配置
 */
const REWARD_MULTIPLIERS = {
  ENLIGHTENMENT_MIN: 45,
  ENLIGHTENMENT_MAX: 54,
  DEMON_MIN: 5,
  DEMON_MAX: 14,
  LUCKY_MIN: 40,
  LUCKY_MAX: 49,
  UNLUCKY_MIN: 5,
  UNLUCKY_MAX: 14,
  SPECIAL_MIN: 20,
  SPECIAL_MAX: 29
} as const;

/**
 * 道具效果配置
 */
const ITEM_EFFECTS = {
  MOJIE_MIBAO_XIUWEI_BONUS: 0.15,
  SHENJIE_MIBAO_QIXUE_BONUS: 0.1,
  MOJIE_THRESHOLD: 999,
  SHENJIE_THRESHOLD: 1,
  LEVEL_THRESHOLD: 41
} as const;

/**
 * 计算实际闭关时间（毫秒）
 * @param action 动作记录
 * @returns 实际闭关时间（毫秒）
 */
const calculateActualCultivationTime = (action: ActionRecord): number => {
  const now = Date.now();
  const startTime = action.end_time - action.time;
  const actualTime = now - startTime;

  // 添加调试日志
  logger.debug(`闭关时间计算 - 当前时间: ${now}, 结束时间: ${action.end_time}, 持续时间: ${action.time}, 开始时间: ${startTime}, 实际时间: ${actualTime}`);

  return Math.max(0, actualTime);
};

/**
 * 计算实际降妖时间（毫秒）
 * @param action 动作记录
 * @returns 实际降妖时间（毫秒）
 */
const calculateActualWorkTime = (action: ActionRecord): number => {
  const now = Date.now();
  const startTime = action.end_time - action.time;
  const actualTime = now - startTime;

  // 添加调试日志
  logger.debug(`降妖时间计算 - 当前时间: ${now}, 结束时间: ${action.end_time}, 持续时间: ${action.time}, 开始时间: ${startTime}, 实际时间: ${actualTime}`);

  return Math.max(0, actualTime);
};

/**
 * 计算闭关收益系数（30分钟后仍有增长，但增长变少）
 * @param actualTime 实际闭关时间（毫秒）
 * @returns 收益系数
 */
const calculateCultivationEfficiency = (actualTime: number): number => {
  const timeMinutes = actualTime / BASE_CONFIG.TIME_CONVERSION;
  const optimalMinutes = BASE_CONFIG.OPTIMAL_CULTIVATION_TIME / BASE_CONFIG.TIME_CONVERSION;

  if (timeMinutes <= 10) {
    // 10分钟以内不给收益
    return 0;
  }

  if (timeMinutes <= optimalMinutes) {
    // 10-30分钟：线性增长到最佳效率
    return (timeMinutes - 10) / (optimalMinutes - 10);
  }

  // 30分钟以上：仍有增长，但增长变少
  // 使用对数函数实现增长递减效果
  const excessTime = timeMinutes - optimalMinutes;
  const growthFactor
    = Math.log(1 + excessTime / INCOME_CURVE_CONFIG.CULTIVATION.GROWTH_DECAY_PERIOD) / Math.log(INCOME_CURVE_CONFIG.CULTIVATION.GROWTH_DECAY_BASE);
  const efficiency = 1 + growthFactor * INCOME_CURVE_CONFIG.CULTIVATION.MAX_EXTRA_GROWTH;

  return efficiency;
};

/**
 * 计算降妖收益系数（15分钟后仍有增长，但增长变少）
 * @param actualTime 实际降妖时间（毫秒）
 * @returns 收益系数
 */
const calculateWorkEfficiency = (actualTime: number): number => {
  const timeMinutes = actualTime / BASE_CONFIG.TIME_CONVERSION;
  const optimalMinutes = BASE_CONFIG.OPTIMAL_WORK_TIME / BASE_CONFIG.TIME_CONVERSION;

  if (timeMinutes <= 5) {
    // 5分钟以内不给收益
    return 0;
  }

  if (timeMinutes <= optimalMinutes) {
    // 5-15分钟：线性增长到最佳效率
    return (timeMinutes - 5) / (optimalMinutes - 5);
  }

  // 15分钟以上：仍有增长，但增长变少
  // 使用对数函数实现增长递减效果
  const excessTime = timeMinutes - optimalMinutes;
  const growthFactor = Math.log(1 + excessTime / INCOME_CURVE_CONFIG.WORK.GROWTH_DECAY_PERIOD) / Math.log(INCOME_CURVE_CONFIG.WORK.GROWTH_DECAY_BASE);
  const efficiency = 1 + growthFactor * INCOME_CURVE_CONFIG.WORK.MAX_EXTRA_GROWTH;

  return efficiency;
};

/**
 * 处理炼丹师丹药效果
 * @param playerId 玩家ID
 * @param dy 丹药数据
 * @returns 丹药效果信息
 */
const handleDanyaoEffects = async (playerId: string, dy: any): Promise<{ transformation: string; beiyong4: number }> => {
  let transformation = '修为';
  const beiyong4 = dy.beiyong4 ?? 0;

  if (dy.biguan > 0) {
    dy.biguan--;
    if (dy.biguan === 0) {
      dy.biguanxl = 0;
    }
  }

  if (dy.lianti > 0) {
    transformation = '血气';
    dy.lianti--;
  }

  if (dy.lianti <= 0) {
    dy.lianti = 0;
    dy.beiyong4 = 0;
  }

  await writeDanyao(playerId, dy);

  return { transformation, beiyong4 };
};

/**
 * 处理顿悟事件
 * @param time 时间
 * @param transformation 转化类型
 * @param beiyong4 炼神之力系数
 * @returns 顿悟结果
 */
const handleEnlightenment = (time: number, transformation: string, beiyong4: number): { otherExp: number; qixue: number; message: string } => {
  const rand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.ENLIGHTENMENT_MIN;
  const otherExp = Math.trunc(rand * time);
  const qixue = Math.trunc(rand * time * beiyong4);

  let message = '';

  if (transformation === '血气') {
    message = `\n本次闭关顿悟,受到炼神之力修正,额外增加血气:${qixue}`;
  } else {
    message = `\n本次闭关顿悟,额外增加修为:${otherExp}`;
  }

  return { otherExp, qixue, message };
};

/**
 * 处理走火入魔事件
 * @param time 时间
 * @param transformation 转化类型
 * @param beiyong4 炼神之力系数
 * @returns 走火入魔结果
 */
const handleDemonState = (time: number, transformation: string, beiyong4: number): { otherExp: number; qixue: number; message: string } => {
  const rand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.DEMON_MIN;
  const otherExp = Math.trunc(-1 * rand * time);
  const qixue = Math.trunc(rand * time * beiyong4);

  let message = '';

  if (transformation === '血气') {
    message = `\n由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降${qixue}`;
  } else {
    message = `\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降${Math.abs(otherExp)}`;
  }

  return { otherExp, qixue, message };
};

/**
 * 处理特殊道具效果
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @param xiuwei 基础修为
 * @param time 时间
 * @returns 道具效果结果
 */
const handleSpecialItems = async (
  playerId: string,
  player: Player,
  xiuwei: number,
  time: number
): Promise<{ otherXiuwei: number; qixue: number; message: string }> => {
  let otherXiuwei = 0;
  let qixue = 0;
  let message = '';

  // 魔界秘宝效果
  if ((await existNajieThing(playerId, '魔界秘宝', '道具')) && player.魔道值 > ITEM_EFFECTS.MOJIE_THRESHOLD) {
    otherXiuwei += Math.trunc(xiuwei * ITEM_EFFECTS.MOJIE_MIBAO_XIUWEI_BONUS * time);
    await addNajieThing(playerId, '魔界秘宝', '道具', -1);
    message += `\n消耗了道具[魔界秘宝],额外增加${otherXiuwei}修为`;
    await addExp(playerId, otherXiuwei);
  }

  // 神界秘宝效果
  if (
    (await existNajieThing(playerId, '神界秘宝', '道具'))
    && player.魔道值 < ITEM_EFFECTS.SHENJIE_THRESHOLD
    && (player.灵根?.type === '转生' || player.level_id > ITEM_EFFECTS.LEVEL_THRESHOLD)
  ) {
    qixue = Math.trunc(xiuwei * ITEM_EFFECTS.SHENJIE_MIBAO_QIXUE_BONUS * time);
    await addNajieThing(playerId, '神界秘宝', '道具', -1);
    message += `\n消耗了道具[神界秘宝],额外增加${qixue}血气`;
    await addExp2(playerId, qixue);
  }

  return { otherXiuwei, qixue, message };
};

/**
 * 处理闭关结算
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param player 玩家数据
 * @param config 配置信息
 * @param pushAddress 推送地址
 * @param isGroup 是否群组
 * @returns 是否处理成功
 */
export const handleCultivationSettlement = async (
  playerId: string,
  action: ActionRecord,
  player: Player,
  config: any,
  options: {
    pushAddress?: string | undefined;
    isGroup?: boolean;
    callback?: (msg: string) => void;
  }
): Promise<boolean> => {
  const { pushAddress = '', isGroup = false, callback } = options;

  // 构建消息
  const msg: Array<string> = [];

  try {
    // 删除行为
    void delDataByKey(keysAction.action(playerId));

    // 计算实际闭关时间
    const actualCultivationTime = calculateActualCultivationTime(action);

    // 检查是否达到最小闭关时间（10分钟）
    if (actualCultivationTime < BASE_CONFIG.MIN_CULTIVATION_TIME) {
      const remainingTime = Math.ceil((BASE_CONFIG.MIN_CULTIVATION_TIME - actualCultivationTime) / 60000);
      const message = `闭关时间不足，需要至少闭关10分钟才能获得收益。还需闭关${remainingTime}分钟。`;

      msg.push(message);
    }

    // 计算收益递减系数
    const efficiency = calculateCultivationEfficiency(actualCultivationTime);

    // 如果效率为0（时间不足），直接返回，不进行收益计算
    if (efficiency === 0) {
      if (callback) {
        callback(msg.join(''));

        return true;
      } else {
        void pushMessage(
          {
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
          },
          [Text(msg.join(''))]
        );

        return true;
      }
    }

    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(item => item.level_id === player.level_id);

    if (!levelInfo) {
      return false;
    }

    const nowLevelId = levelInfo.level_id;
    const size = config?.biguan?.size ?? 1;
    const baseXiuwei = Math.floor(size * nowLevelId * (player.修炼效率提升 + 1) * BASE_CONFIG.CULTIVATION_INCOME_MULTIPLIER);
    const blood = Math.floor(player.血量上限 * BASE_CONFIG.BLOOD_RECOVERY_RATE);

    // 使用实际闭关时间计算收益（转换为分钟）
    const time = actualCultivationTime / BASE_CONFIG.TIME_CONVERSION;

    // 基础收益（不应用递减系数）
    const xiuwei = baseXiuwei;

    // 处理炼丹师丹药效果
    const dy = await readDanyao(playerId);
    const { transformation, beiyong4 } = await handleDanyaoEffects(playerId, dy);

    // 处理随机事件
    const rand = Math.random();
    let otherExp = 0;
    let eventMessage = '';

    if (rand < BASE_CONFIG.ENLIGHTENMENT_CHANCE) {
      const result = handleEnlightenment(time, transformation, beiyong4);

      otherExp = result.otherExp;
      eventMessage = result.message;
    } else if (rand > BASE_CONFIG.DEMON_CHANCE) {
      const result = handleDemonState(time, transformation, beiyong4);

      otherExp = result.otherExp;
      eventMessage = result.message;
    }

    // 处理特殊道具效果
    const itemResult = await handleSpecialItems(playerId, player, xiuwei, time);

    // 更新血量
    await setFileValue(playerId, Math.floor(blood * time), '当前血量');

    // 计算最终奖励（应用收益递减系数）
    const baseFinalXiuwei = Math.floor(xiuwei * time + otherExp);
    const baseFinalQixue = Math.trunc(xiuwei * time * beiyong4);

    // 应用收益递减系数到最终收益
    const finalXiuwei = Math.floor(baseFinalXiuwei * efficiency);
    const finalQixue = Math.trunc(baseFinalQixue * efficiency);

    // 设置修为或血气
    if (transformation === '血气') {
      await setFileValue(playerId, Math.floor(finalXiuwei * beiyong4), transformation);
    } else {
      await setFileValue(playerId, finalXiuwei, transformation);
    }

    msg.push(eventMessage);
    msg.push(itemResult.message);

    if (transformation === '血气') {
      msg.push(`\n受到炼神之力的影响,增加气血:${finalQixue},血量增加:${Math.floor(blood * time)}`);
    } else {
      msg.push(`\n增加修为:${finalXiuwei},血量增加:${Math.floor(blood * time)}`);
    }

    if (callback) {
      callback(msg.join(''));

      return true;
    } else {
      void pushMessage(
        {
          uid: playerId,
          cid: isGroup && pushAddress ? pushAddress : ''
        },
        [Text(msg.join(''))]
      );

      return true;
    }
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 处理降妖结算
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param player 玩家数据
 * @param config 配置信息
 * @param pushAddress 推送地址
 * @param isGroup 是否群组
 * @returns 是否处理成功
 */
export const handleWorkSettlement = async (
  playerId: string,
  action: ActionRecord,
  player: Player,
  config: any,
  options: {
    pushAddress?: string | undefined;
    isGroup?: boolean;
    callback?: (msg: string) => void;
  }
): Promise<boolean> => {
  const { pushAddress = '', isGroup = false, callback } = options;

  // 构建消息
  const msg: Array<string> = [];

  try {
    void delDataByKey(keysAction.action(playerId));

    // 计算实际降妖时间
    const actualWorkTime = calculateActualWorkTime(action);

    // 检查是否达到最小降妖时间（5分钟）
    if (actualWorkTime < BASE_CONFIG.MIN_WORK_TIME) {
      const remainingTime = Math.ceil((BASE_CONFIG.MIN_WORK_TIME - actualWorkTime) / 60000);
      const message = `降妖时间不足，需要至少降妖5分钟才能获得收益。还需降妖${remainingTime}分钟。`;

      msg.push(message);

      // 仍然执行结算，但会获得0收益
    }

    // 计算收益递减系数
    const efficiency = calculateWorkEfficiency(actualWorkTime);

    // 如果效率为0（时间不足），直接返回，不进行收益计算
    if (efficiency === 0) {
      if (callback) {
        callback(msg.join(''));

        return true;
      } else {
        void pushMessage(
          {
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
          },
          [Text(msg.join(''))]
        );

        return true;
      }
    }

    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(item => item.level_id === player.level_id);

    if (!levelInfo) {
      return false;
    }

    const nowLevelId = levelInfo.level_id;
    const size = config.work.size;
    const baseLingshi = Math.floor(size * nowLevelId * (1 + player.修炼效率提升) * 0.5 * BASE_CONFIG.WORK_INCOME_MULTIPLIER);

    // 使用实际降妖时间计算收益（转换为分钟）
    const time = actualWorkTime / BASE_CONFIG.TIME_CONVERSION;

    // 基础收益（不应用递减系数）
    const lingshi = baseLingshi;

    // 处理随机事件
    const rand = Math.random();
    let otherLingshi = 0;
    let otherQixue = 0;
    let eventMessage = '';

    if (rand < BASE_CONFIG.LUCKY_CHANCE) {
      const luckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.LUCKY_MIN;

      otherLingshi = Math.trunc(luckyRand * time);
      eventMessage = `\n降妖路上途径金银坊，一时手痒入场一掷：6 6 6，额外获得灵石${otherLingshi}`;
    } else if (rand > BASE_CONFIG.UNLUCKY_CHANCE) {
      const unluckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.UNLUCKY_MIN;

      otherLingshi = Math.trunc(-1 * unluckyRand * time);
      eventMessage = `\n途径盗宝团营地，由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少${Math.abs(otherLingshi)}`;
    } else if (rand > BASE_CONFIG.SPECIAL_CHANCE_MIN && rand < BASE_CONFIG.SPECIAL_CHANCE_MAX) {
      const specialRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.SPECIAL_MIN;

      otherLingshi = Math.trunc(-1 * specialRand * time);
      otherQixue = Math.trunc(-2 * specialRand * time);
      eventMessage = `\n归来途中经过怡红院，你抵挡不住诱惑，进去大肆消费了${Math.abs(otherLingshi)}灵石，早上醒来，气血消耗了${Math.abs(otherQixue)}`;
    }

    // 更新玩家血气
    player.血气 += Math.floor(otherQixue);
    await writePlayer(playerId, player);

    // 计算最终灵石（应用收益递减系数）
    const baseFinalLingshi = Math.trunc(lingshi * time + otherLingshi);
    const finalLingshi = Math.trunc(baseFinalLingshi * efficiency);

    await setFileValue(playerId, finalLingshi, '灵石');

    msg.push(eventMessage);

    msg.push(`\n降妖得到${finalLingshi}灵石`);

    if (callback) {
      callback(msg.join(''));
    } else {
      void pushMessage(
        {
          uid: playerId,
          cid: isGroup && pushAddress ? pushAddress : ''
        },
        [Text(msg.join(''))]
      );
    }

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 处理单个玩家的状态
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param config 配置信息
 * @returns 是否处理成功
 */
const processPlayerState = async (playerId: string, action: ActionRecord, config: any): Promise<boolean> => {
  try {
    const { pushAddress, isGroup } = getPushInfo(action, playerId);
    const nowTime = Date.now();

    // 处理天牢状态 - 检查天牢时间是否结束
    if (action.action === '天牢' && nowTime >= action.end_time) {
      // 天牢时间结束，将玩家状态设置为空闲
      action.action = '空闲';
      action.end_time = Date.now();

      await setDataJSONStringifyByKey(keysAction.action(playerId), action);

      // 推送天牢结束消息
      const message = '\n天牢时间已到，你重获自由！';

      void pushMessage(
        {
          uid: playerId,
          cid: isGroup && pushAddress ? pushAddress : ''
        },
        [Text(message)]
      );

      return true;
    }

    // 计算实际闭关时间
    const actualCultivationTime = calculateActualCultivationTime(action);
    // 计算实际降妖时间
    const actualWorkTime = calculateActualWorkTime(action);

    // 检查是否达到最小闭关时间（10分钟）
    if (action.shutup === '0' && actualCultivationTime < BASE_CONFIG.MIN_CULTIVATION_TIME) {
      // 闭关时间不足，仍然进行结算但会获得0收益
    }

    // 检查是否达到最小降妖时间（5分钟）
    if (action.working === '0' && actualWorkTime < BASE_CONFIG.MIN_WORK_TIME) {
      // 降妖时间不足，仍然进行结算但会获得0收益
    }

    // 检查是否到了结算时间（提前2分钟结算）
    let endTime = action.end_time;

    endTime = endTime - BASE_CONFIG.SETTLEMENT_TIME_OFFSET;

    // 是否到收益时间
    if (nowTime > endTime) {
      const player = await readPlayer(playerId);

      if (!player || !notUndAndNull(player.level_id)) {
        return false;
      }

      let success = false;

      // 处理闭关状态
      if (action.shutup === '0') {
        success = await handleCultivationSettlement(playerId, action, player, config, { pushAddress, isGroup });
      }

      // 处理降妖状态
      if (action.working === '0') {
        success = await handleWorkSettlement(playerId, action, player, config, { pushAddress, isGroup });
      }

      return success;
    }

    return false;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 玩家控制任务 - 处理玩家闭关、降妖和天牢状态
 * 遍历所有玩家，检查处于闭关、降妖或天牢状态的玩家，进行结算处理
 * @description shutup、working 都为 0 时，不进行结算；天牢状态到期时自动设置为空闲
 */
export const handelAction = async (playerId: string, action: ActionRecord, { config }): Promise<void> => {
  try {
    if (!config) {
      return;
    }

    await processPlayerState(playerId, action, config);
  } catch (error) {
    logger.error(error);
  }
};
