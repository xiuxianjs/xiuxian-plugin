/**
 * 每日任务系统
 * 封装各项每日任务的状态检查功能
 */

import { redis } from './api';
import { readPlayer, shijianc, writePlayer } from './index';
import { keysAction, getRedisKey } from './keys';
import { getDataByKey } from './DataControl';
import { readTiandibang } from './tian';

interface DayInfo {
  Y: number;
  M: number;
  D: number;
}

function isDateParts(v: any): v is DayInfo {
  return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}

function isSameDay(time1: number, time2: number): boolean {
  const d1 = shijianc(time1);
  const d2 = shijianc(time2);

  return d1.Y === d2.Y && d1.M === d2.M && d1.D === d2.D;
}

function isDayChanged(a: DayInfo | null, b: DayInfo | null): boolean {
  if (!a || !b) {
    return true;
  }

  return a.Y !== b.Y || a.M !== b.M || a.D !== b.D;
}

/**
 * 签到状态
 */
export interface SignStatus {
  completed: boolean; // 是否已签到
  consecutiveDays: number; // 连续签到天数
}

/**
 * 每日比试状态
 */
export interface BiwuStatus {
  completed: boolean; // 是否已完成
  currentCount: number; // 今日已比试次数
  maxCount: number; // 每日最大次数
  isRegistered: boolean; // 是否已报名比赛
  remainingCount: number; // 剩余次数
}

/**
 * 开采灵脉状态
 */
export interface ExploitationStatus {
  completed: boolean; // 是否已开采
}

/**
 * 神兽赐福状态
 */
export interface BeastBonusStatus {
  completed: boolean; // 是否已赐福
}

/**
 * 踏入神界状态
 */
export interface ShenjieStatus {
  remainingCount: number; // 剩余次数
  maxCount: number; // 每日最大次数
  isMojie: boolean; // 是否为魔界（魔道值>0）
  modaoValue: number; // 当前魔道值
}

/**
 * 每日任务汇总
 */
export interface DailyTasksStatus {
  sign: SignStatus;
  biwu: BiwuStatus;
  exploitation: ExploitationStatus;
  beastBonus: BeastBonusStatus;
  shenjie: ShenjieStatus;
}

/**
 * 检查签到状态
 */
export async function checkSignStatus(userId: string): Promise<SignStatus> {
  const nowTime = Date.now();
  const lastSignRaw = await redis.get(getRedisKey(userId, 'lastsign_time'));

  let completed = false;

  if (lastSignRaw) {
    try {
      const lastSignStruct = JSON.parse(lastSignRaw);

      // sign = 1：普通签到，sign = 2：月卡签到或补签
      if (lastSignStruct && isSameDay(lastSignStruct.time, nowTime) && (lastSignStruct.sign === 1 || lastSignStruct.sign === 2)) {
        completed = true;
      }
    } catch (error) {
      console.error('检查签到状态解析错误', error);
      // 忽略解析错误
    }
  }

  const player = await readPlayer(userId);
  const consecutiveDays = player?.连续签到天数 ?? 0;

  return {
    completed,
    consecutiveDays
  };
}

/**
 * 检查每日比试状态
 */
export async function checkBiwuStatus(userId: string): Promise<BiwuStatus> {
  const MAX_BIWU_PER_DAY = 3;

  // 检查是否报名比赛（在天地榜中）
  const tiandibang: any[] = await readTiandibang();
  const playerIndex = tiandibang.findIndex(item => item.qq === userId);

  if (playerIndex === -1) {
    // 未报名比赛
    return {
      completed: false,
      currentCount: 0,
      maxCount: MAX_BIWU_PER_DAY,
      isRegistered: false,
      remainingCount: 0
    };
  }

  // 已报名，获取剩余次数
  const playerData = tiandibang[playerIndex];
  const remainingCount = typeof playerData.次数 === 'number' ? Math.max(0, playerData.次数) : 0;
  const currentCount = MAX_BIWU_PER_DAY - remainingCount;
  const completed = remainingCount === 0;

  return {
    completed,
    currentCount,
    maxCount: MAX_BIWU_PER_DAY,
    isRegistered: true,
    remainingCount
  };
}

/**
 * 检查开采灵脉状态
 */
export async function checkExploitationStatus(userId: string): Promise<ExploitationStatus> {
  const nowTime = Date.now();
  const today = shijianc(nowTime);

  const lastsignTime = await getLastsignExplor(userId);

  let completed = false;

  if (isDateParts(today) && isDateParts(lastsignTime)) {
    if (today.Y === lastsignTime.Y && today.M === lastsignTime.M && today.D === lastsignTime.D) {
      completed = true;
    }
  }

  return {
    completed
  };
}

async function getLastsignExplor(userId: string): Promise<DayInfo | null> {
  const time = await getDataByKey(keysAction.getLastSignExplor(userId));

  if (time) {
    const parts = shijianc(Number(time));

    if (isDateParts(parts)) {
      return parts;
    }
  }

  return null;
}

/**
 * 检查神兽赐福状态
 */
export async function checkBeastBonusStatus(userId: string): Promise<BeastBonusStatus> {
  const nowTime = Date.now();
  const today = shijianc(nowTime);

  const lastsignTime = await getLastsignBonus(userId);

  let completed = false;

  if (isDateParts(today) && isDateParts(lastsignTime)) {
    if (today.Y === lastsignTime.Y && today.M === lastsignTime.M && today.D === lastsignTime.D) {
      completed = true;
    }
  }

  return {
    completed
  };
}

async function getLastsignBonus(userId: string): Promise<DayInfo | null> {
  const time = await getDataByKey(keysAction.getLastSignBonus(userId));

  if (time) {
    const parts = shijianc(Number(time));

    if (isDateParts(parts)) {
      return parts;
    }
  }

  return null;
}

/**
 * 根据灵根计算踏入神界的每日最大次数
 */
function getMaxShenjieCountByLinggen(player: any): number {
  const linggenName = player?.灵根?.name;

  if (!linggenName) {
    return 1;
  }

  // 根据灵根名称返回对应次数
  if (linggenName === '二转轮回体') {
    return 2;
  } else if (linggenName === '三转轮回体' || linggenName === '四转轮回体') {
    return 3;
  } else if (linggenName === '五转轮回体' || linggenName === '六转轮回体') {
    return 4;
  } else if (linggenName === '七转轮回体' || linggenName === '八转轮回体') {
    return 4;
  } else if (linggenName === '九转轮回体') {
    return 5;
  }

  return 1; // 默认1次
}

/**
 * 检查踏入神界状态
 */
export async function checkShenjieStatus(userId: string): Promise<ShenjieStatus> {
  let player = await readPlayer(userId);

  if (!player) {
    return {
      remainingCount: 0,
      maxCount: 1,
      isMojie: false,
      modaoValue: 0
    };
  }

  // 获取魔道值
  const modaoValue = typeof player.魔道值 === 'number' ? player.魔道值 : 0;
  const isMojie = modaoValue > 0;

  // 如果是魔界，不需要计算次数
  if (isMojie) {
    return {
      remainingCount: 0,
      maxCount: 0,
      isMojie: true,
      modaoValue
    };
  }

  // 每日刷新神界次数：逻辑修正为任一日期字段变化即刷新
  const now = Date.now();
  const today = shijianc(now);
  const lastTimeRaw = await redis.get(getRedisKey(userId, 'lastdagong_time'));
  const lastDay = lastTimeRaw ? shijianc(Number(lastTimeRaw)) : null;

  if (isDayChanged(today, lastDay)) {
    await redis.set(getRedisKey(userId, 'lastdagong_time'), String(now));

    // 根据灵根计算新的次数
    const newCount = getMaxShenjieCountByLinggen(player);

    player.神界次数 = newCount;
    await writePlayer(userId, player);
  }

  // 重新读取玩家数据，确保获取最新的神界次数
  player = await readPlayer(userId);

  if (!player) {
    return {
      remainingCount: 0,
      maxCount: 1,
      isMojie: false,
      modaoValue: 0
    };
  }

  // 根据灵根获取每日最大次数
  const maxCount = getMaxShenjieCountByLinggen(player);

  // 获取剩余次数，直接从player.神界次数读取
  const remainingCount = Math.max(0, typeof player.神界次数 === 'number' ? player.神界次数 : maxCount);

  return {
    remainingCount,
    maxCount,
    isMojie: false,
    modaoValue: 0
  };
}

/**
 * 获取所有每日任务状态
 */
export async function getAllDailyTasksStatus(userId: string): Promise<DailyTasksStatus> {
  const [sign, biwu, exploitation, beastBonus, shenjie] = await Promise.all([
    checkSignStatus(userId),
    checkBiwuStatus(userId),
    checkExploitationStatus(userId),
    checkBeastBonusStatus(userId),
    checkShenjieStatus(userId)
  ]);

  return {
    sign,
    biwu,
    exploitation,
    beastBonus,
    shenjie
  };
}
