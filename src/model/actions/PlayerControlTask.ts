import { notUndAndNull } from '@src/model/common';
import { delDataByKey, readPlayer, writePlayer } from '@src/model';
import { readDanyao, writeDanyao } from '@src/model/danyao';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { addExp, addExp2 } from '@src/model/economy';
import { setFileValue } from '@src/model/cultivation';
import { __PATH, keysAction } from '@src/model/keys';
import { DataMention, Mention, Text } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import type { Player } from '@src/types/player';
import { setMessage } from '../MessageSystem';

interface ActionState {
  end_time: number;
  time: number | string;
  shutup?: string | number;
  working?: string | number;
  power_up?: number;
  Place_action?: number;
  Place_actionplus?: number;
  group_id?: string | number;
  acount?: number | null;
}

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  SETTLEMENT_TIME_OFFSET: 60000 * 2, // 提前2分钟结算
  TIME_CONVERSION: 1000 * 60, // 毫秒转分钟
  BLOOD_RECOVERY_RATE: 0.02, // 血量恢复比例
  ENLIGHTENMENT_CHANCE: 0.2, // 顿悟概率
  DEMON_CHANCE: 0.8, // 走火入魔概率
  LUCKY_CHANCE: 0.2, // 幸运事件概率
  UNLUCKY_CHANCE: 0.8, // 不幸事件概率
  SPECIAL_CHANCE_MIN: 0.5, // 特殊事件最小概率
  SPECIAL_CHANCE_MAX: 0.6 // 特殊事件最大概率
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
 * 解析时间参数
 * @param rawTime 原始时间参数
 * @returns 分钟数
 */
const parseTime = (rawTime: number | string): number => {
  const time = typeof rawTime === 'number' ? rawTime : parseInt(String(rawTime) || '0', 10);

  return time / BASE_CONFIG.TIME_CONVERSION;
};

/**
 * 获取推送信息
 * @param action 动作状态
 * @returns 推送信息
 */
const getPushInfo = (action: ActionState): { pushAddress: string | undefined; isGroup: boolean } => {
  let pushAddress: string | undefined;
  let isGroup = false;

  if (Object.prototype.hasOwnProperty.call(action, 'group_id') && notUndAndNull(action.group_id)) {
    isGroup = true;
    pushAddress = action.group_id;
  }

  return { pushAddress, isGroup };
};

/**
 * 处理炼丹师丹药效果
 * @param playerId 玩家ID
 * @param dy 丹药数据
 * @returns 丹药效果信息
 */
const handleDanyaoEffects = async (playerId: string, dy: any): Promise<{ transformation: string; beiyong4: number }> => {
  let transformation = '修为';
  let beiyong4 = dy.beiyong4 || 0;

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
    beiyong4 = 0;
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
  const otherExp = rand * time;
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
  const otherExp = -1 * rand * time;
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
    (await existNajieThing(playerId, '神界秘宝', '道具')) &&
    player.魔道值 < ITEM_EFFECTS.SHENJIE_THRESHOLD &&
    (player.灵根?.type === '转生' || player.level_id > ITEM_EFFECTS.LEVEL_THRESHOLD)
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
const handleCultivationSettlement = async (
  playerId: string,
  action: ActionState,
  player: Player,
  config: any,
  pushAddress: string | undefined,
  isGroup: boolean
): Promise<boolean> => {
  try {
    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(item => item.level_id === player.level_id);

    if (!levelInfo) {
      return false;
    }

    const nowLevelId = levelInfo.level_id;
    const size = config.biguan.size;
    const xiuwei = Math.floor(size * nowLevelId * (player.修炼效率提升 + 1));
    const blood = Math.floor(player.血量上限 * BASE_CONFIG.BLOOD_RECOVERY_RATE);
    const time = parseTime(action.time);

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
    await setFileValue(playerId, blood * time, '当前血量');

    // 删除行为
    void delDataByKey(keysAction.action(playerId));

    // 计算最终奖励
    const finalXiuwei = xiuwei * time + otherExp;
    const finalQixue = Math.trunc(xiuwei * time * beiyong4);

    // 设置修为或血气
    if (transformation === '血气') {
      await setFileValue(playerId, finalXiuwei * beiyong4, transformation);
    } else {
      await setFileValue(playerId, finalXiuwei, transformation);
    }

    // 构建消息
    const msg: Array<DataMention | string> = [Mention(playerId)];

    msg.push(eventMessage);
    msg.push(itemResult.message);

    if (transformation === '血气') {
      msg.push(`\n受到炼神之力的影响,增加气血:${finalQixue},血量增加:${blood * time}`);
    } else {
      msg.push(`\n增加修为:${finalXiuwei},血量增加:${blood * time}`);
    }

    //
    void setMessage({
      id: '',
      uid: playerId,
      cid: isGroup && pushAddress ? pushAddress : '',
      data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
    });

    return true;
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
const handleWorkSettlement = async (
  playerId: string,
  action: ActionState,
  player: Player,
  config: any,
  pushAddress: string | undefined,
  isGroup: boolean
): Promise<boolean> => {
  try {
    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(item => item.level_id === player.level_id);

    if (!levelInfo) {
      return false;
    }

    const nowLevelId = levelInfo.level_id;
    const size = config.work.size;
    const lingshi = Math.floor(size * nowLevelId * (1 + player.修炼效率提升) * 0.5);
    const time = parseTime(action.time);

    // 处理随机事件
    const rand = Math.random();
    let otherLingshi = 0;
    let otherQixue = 0;
    let eventMessage = '';

    if (rand < BASE_CONFIG.LUCKY_CHANCE) {
      const luckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.LUCKY_MIN;

      otherLingshi = luckyRand * time;
      eventMessage = `\n降妖路上途径金银坊，一时手痒入场一掷：6 6 6，额外获得灵石${otherLingshi}`;
    } else if (rand > BASE_CONFIG.UNLUCKY_CHANCE) {
      const unluckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.UNLUCKY_MIN;

      otherLingshi = -1 * unluckyRand * time;
      eventMessage = `\n途径盗宝团营地，由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少${Math.abs(otherLingshi)}`;
    } else if (rand > BASE_CONFIG.SPECIAL_CHANCE_MIN && rand < BASE_CONFIG.SPECIAL_CHANCE_MAX) {
      const specialRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.SPECIAL_MIN;

      otherLingshi = -1 * specialRand * time;
      otherQixue = -2 * specialRand * time;
      eventMessage = `\n归来途中经过怡红院，你抵挡不住诱惑，进去大肆消费了${Math.abs(otherLingshi)}灵石，早上醒来，气血消耗了${Math.abs(otherQixue)}`;
    }

    // 更新玩家血气
    player.血气 += otherQixue;
    await writePlayer(playerId, player);

    // 计算最终灵石
    const finalLingshi = Math.trunc(lingshi * time + otherLingshi);

    await setFileValue(playerId, finalLingshi, '灵石');

    void delDataByKey(keysAction.action(playerId));

    // 构建消息
    const msg: Array<DataMention | string> = [Mention(playerId)];

    msg.push(eventMessage);
    msg.push(`\n降妖得到${finalLingshi}灵石`);

    void setMessage({
      id: '',
      uid: playerId,
      cid: isGroup && pushAddress ? pushAddress : '',
      data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
    });

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
const processPlayerState = async (playerId: string, action: ActionState, config: any): Promise<boolean> => {
  try {
    const { pushAddress, isGroup } = getPushInfo(action);
    let endTime = action.end_time;
    const nowTime = Date.now();

    // 提前2分钟结算
    endTime = endTime - BASE_CONFIG.SETTLEMENT_TIME_OFFSET;

    if (nowTime > endTime) {
      const player = await readPlayer(playerId);

      if (!player || !notUndAndNull(player.level_id)) {
        return false;
      }

      let success = false;

      // 处理闭关状态
      if (action.shutup === '0') {
        success = await handleCultivationSettlement(playerId, action, player, config, pushAddress, isGroup);
      }

      // 处理降妖状态
      if (action.working === '0') {
        success = await handleWorkSettlement(playerId, action, player, config, pushAddress, isGroup);
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
 * 玩家控制任务 - 处理玩家闭关和降妖状态
 * 遍历所有玩家，检查处于闭关或降妖状态的玩家，进行结算处理
 * @description shutup、working 都为 0 时，不进行结算
 */
export const handelAction = async (playerId: string, action: ActionState, { config }): Promise<void> => {
  try {
    if (!config) {
      return;
    }

    await processPlayerState(playerId, action, config);
  } catch (error) {
    logger.error(error);
  }
};
