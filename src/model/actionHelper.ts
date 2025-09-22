import { getJSON, setValue, userKey } from '@src/model/utils/redisHelper';
import { ActionRecord } from '@src/types';
import { ActionType } from '@src/types/keys';

// 默认动作 key；支持自定义 suffix 以兼容特殊场景（如锻造使用 action10）
export function actionRedisKey(userId: string | number, suffix: ActionType = 'action') {
  return userKey(userId, suffix);
}

export function readAction(userId: string | number) {
  return getJSON<ActionRecord>(actionRedisKey(userId));
}

export function readActionWithSuffix(userId: string | number, suffix?: ActionType) {
  return getJSON<ActionRecord>(actionRedisKey(userId, suffix));
}

export async function writeAction(userId: string | number, record: ActionRecord) {
  await setValue(actionRedisKey(userId), record);
}

export function isActionRunning(record: ActionRecord | null | undefined, now = Date.now()) {
  if (!record) {
    return false;
  }

  return now <= record.end_time;
}

// 通用启动：传入动作名与持续时长（毫秒）以及附加 flag
export function startAction(userId: string | number, name: string, durationMs: number, flags: Partial<ActionRecord>) {
  return startActionWithSuffix(userId, 'action', name, durationMs, flags);
}

export async function startActionWithSuffix(userId: string | number, suffix: ActionType, name: string, durationMs: number, flags: Partial<ActionRecord>) {
  const now = Date.now();
  const record: ActionRecord = {
    action: name,
    end_time: now + durationMs,
    time: durationMs,
    ...flags
  };

  await setValue(actionRedisKey(userId, suffix), record);

  return record;
}

// 便捷：闭关动作（默认 30 分钟，向上取 30 的倍数，最大 30*240）
export function normalizeBiguanMinutes(raw: number | undefined): number {
  const DEFAULT_MIN = 30;
  const STEP = 30;
  const MAX_MULTIPLIER = 240; // 与旧逻辑一致（30 * 240 分）

  if (!raw || Number.isNaN(raw)) {
    return DEFAULT_MIN;
  }
  let m = Math.max(raw, DEFAULT_MIN);

  // 向下对齐到 STEP 的倍数但不超过最大
  for (let i = MAX_MULTIPLIER; i > 0; i--) {
    if (m >= STEP * i) {
      m = STEP * i;
      break;
    }
  }

  return m;
}

// 通用分钟归一：
// raw 任意输入；step 步长；loops 最大循环次数（决定最大 = step * loops）；min 最小值
export function normalizeDurationMinutes(raw, step: number, loops: number, min: number): number {
  const parsed = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);

  if (Number.isNaN(parsed)) {
    return min;
  }
  let m = parsed;
  const max = step * loops;

  if (m > max) {
    m = max;
  }
  for (let i = loops; i > 0; i--) {
    if (m >= step * i) {
      m = step * i;
      break;
    }
  }
  if (m < min) {
    m = min;
  }

  return m;
}

// 计算剩余毫秒
export function remainingMs(record: ActionRecord, now = Date.now()): number {
  return Math.max(0, record.end_time - now);
}

// 格式化剩余 mm分ss秒
export function formatRemaining(ms: number) {
  // 转为 时 分 秒 格式
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return `${h}时${m}分${s}秒`;
}

// 通用更新：传入回调，回调返回新的记录（或 null 代表不更新）
export async function updateAction(userId: string | number, updater: (prev: ActionRecord | null) => ActionRecord | null) {
  const prev = await readAction(userId);
  const next = updater(prev);

  if (next) {
    await writeAction(userId, next);
  }

  return next;
}

export async function updateActionWithSuffix(userId: string | number, suffix: ActionType, updater: (prev: ActionRecord | null) => ActionRecord | null) {
  const prev = await readActionWithSuffix(userId, suffix);
  const next = updater(prev);

  if (next) {
    await setValue(actionRedisKey(userId, suffix), next);
  }

  return next;
}

// 提前结束当前动作（若存在），可附加额外字段覆盖；返回更新后的记录
export function stopAction(userId: string | number, extra: Partial<ActionRecord & {}> = {}) {
  return updateAction(userId, prev => {
    if (!prev) {
      return null;
    }

    // 重置所有状态为空闲
    return {
      ...prev,
      action: '空闲',
      end_time: Date.now(),
      shutup: '1', // 闭关状态重置为空闲
      working: '1', // 降妖状态重置为空闲
      power_up: '1', // 修炼状态重置为空闲
      Place_action: '1', // 秘境状态重置为空闲
      Place_actionplus: '1', // 秘境plus状态重置为空闲
      plant: '1', // 采药状态重置为空闲
      mine: '1', // 采矿状态重置为空闲
      mojie: '1', // 魔界状态重置为空闲
      xijie: '1', // 洗劫状态重置为空闲
      ...extra
    };
  });
}

export function stopActionWithSuffix(userId: string | number, suffix: ActionType, extra: Partial<ActionRecord & {}> = {}) {
  return updateActionWithSuffix(userId, suffix, prev => {
    if (!prev) {
      return null;
    }

    return {
      ...prev,
      end_time: Date.now(),
      ...extra
    };
  });
}
