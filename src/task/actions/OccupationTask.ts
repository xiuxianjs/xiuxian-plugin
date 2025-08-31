import { notUndAndNull } from '@src/model/common';
import { getDataJSONParseByKey, readPlayer, setDataJSONStringifyByKey } from '@src/model';
import { __PATH, keysAction, keysByPath, keysLock } from '@src/model/keys';
import type { ActionState } from '@src/types';
import { mine_jiesuan, plant_jiesuan, calcEffectiveMinutes } from '@src/response/Occupation/api';
import { withLock } from '@src/model/locks';

interface OccupationActionState extends ActionState {
  plant?: string | number;
  mine?: string | number;
  is_jiesuan?: number;
  end_time: number;
  time: number | string;
  group_id?: string | number;
}

interface SettlementResult {
  success: boolean;
  message?: string;
}

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  SETTLEMENT_TIME_OFFSET: 60000 * 2, // 提前2分钟结算
  TIME_CONVERSION: 1000 * 60, // 毫秒转分钟
  SETTLED_FLAG: 1, // 已结算标志
  ACTIVE_FLAG: 1, // 激活状态标志
  INACTIVE_FLAG: '0' // 非激活状态标志
} as const;

/**
 * 解析时间参数
 * @param rawTime 原始时间参数
 * @returns 分钟数
 */
const parseTime = (rawTime: number | string): number => {
  const time = typeof rawTime === 'string' ? parseInt(rawTime) : Number(rawTime);

  return isNaN(time) ? 0 : time / BASE_CONFIG.TIME_CONVERSION;
};

/**
 * 获取推送地址
 * @param action 动作状态
 * @returns 推送地址
 */
const getPushAddress = (action: OccupationActionState): string | undefined => {
  if ('group_id' in action && notUndAndNull(action.group_id)) {
    return String(action.group_id);
  }

  return undefined;
};

/**
 * 检查是否到达结算时间
 * @param endTime 结束时间
 * @returns 是否到达结算时间
 */
const isSettlementTime = (endTime: number): boolean => {
  const settlementTime = endTime - BASE_CONFIG.SETTLEMENT_TIME_OFFSET;

  return Date.now() > settlementTime;
};

/**
 * 重置所有状态
 * @param action 动作状态
 * @returns 重置后的状态
 */
const resetAllStates = (action: OccupationActionState): OccupationActionState => {
  const resetAction = { ...action };

  resetAction.shutup = BASE_CONFIG.ACTIVE_FLAG;
  resetAction.working = BASE_CONFIG.ACTIVE_FLAG;
  resetAction.power_up = BASE_CONFIG.ACTIVE_FLAG;
  resetAction.Place_action = BASE_CONFIG.ACTIVE_FLAG;
  resetAction.Place_actionplus = BASE_CONFIG.ACTIVE_FLAG;

  delete resetAction.group_id;

  return resetAction;
};

/**
 * 处理采药结算
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param pushAddress 推送地址
 * @returns 结算结果
 */
const handlePlantSettlement = async (playerId: string, action: OccupationActionState, pushAddress: string | undefined): Promise<SettlementResult> => {
  try {
    // 检查是否已结算
    if (action.is_jiesuan === BASE_CONFIG.SETTLED_FLAG) {
      return { success: false, message: '已结算，跳过' };
    }

    // 计算有效时间
    const startTime = action.end_time - Number(action.time);
    const now = Date.now();
    const timeMin = calcEffectiveMinutes(startTime, action.end_time, now);

    // 执行采药结算
    await plant_jiesuan(playerId, timeMin, pushAddress);

    // 重置状态
    const resetAction = resetAllStates(action);

    resetAction.is_jiesuan = BASE_CONFIG.SETTLED_FLAG;
    resetAction.plant = BASE_CONFIG.ACTIVE_FLAG;

    await setDataJSONStringifyByKey(keysAction.action(playerId), resetAction);

    return { success: true, message: '采药结算完成' };
  } catch (error) {
    return { success: false, message: `采药结算失败: ${error}` };
  }
};

/**
 * 处理采矿结算
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param pushAddress 推送地址
 * @returns 结算结果
 */
const handleMineSettlement = async (playerId: string, action: OccupationActionState, pushAddress: string | undefined): Promise<SettlementResult> => {
  try {
    // 验证玩家数据
    const playerRaw = await readPlayer(playerId);

    if (!playerRaw || Array.isArray(playerRaw)) {
      return { success: false, message: '玩家数据无效' };
    }

    if (!notUndAndNull(playerRaw.level_id)) {
      return { success: false, message: '玩家等级数据无效' };
    }

    // 计算时间
    const timeMin = parseTime(action.time);

    // 执行采矿结算
    await mine_jiesuan(playerId, timeMin, pushAddress);

    // 重置状态
    const resetAction = resetAllStates(action);

    resetAction.mine = BASE_CONFIG.ACTIVE_FLAG;

    await setDataJSONStringifyByKey(keysAction.action(playerId), resetAction);

    return { success: true, message: '采矿结算完成' };
  } catch (error) {
    return { success: false, message: `采矿结算失败: ${error}` };
  }
};

/**
 * 处理单个玩家的职业状态
 * @param playerId 玩家ID
 * @param action 动作状态
 * @returns 处理结果
 * @description plant、mine 都为 0 时，不进行结算
 */
const processPlayerOccupation = async (playerId: string, action: OccupationActionState): Promise<SettlementResult> => {
  try {
    const pushAddress = getPushAddress(action);
    let settlementResult: SettlementResult = { success: false, message: '无需要结算的状态' };

    // 处理采药状态
    if (action.plant === BASE_CONFIG.INACTIVE_FLAG && isSettlementTime(action.end_time)) {
      settlementResult = await handlePlantSettlement(playerId, action, pushAddress);
    }

    // 处理采矿状态
    if (action.mine === BASE_CONFIG.INACTIVE_FLAG && isSettlementTime(action.end_time)) {
      settlementResult = await handleMineSettlement(playerId, action, pushAddress);
    }

    return settlementResult;
  } catch (error) {
    return { success: false, message: `处理玩家职业状态失败: ${error}` };
  }
};

/**
 * 职业任务 - 处理玩家采药和采矿状态
 * 遍历所有玩家，检查处于采药或采矿状态的玩家，进行结算处理
 */
export const handelAction = async (playerId: string, action: OccupationActionState): Promise<void> => {
  try {
    await processPlayerOccupation(playerId, action);
  } catch (error) {
    logger.error(error);
  }
};
