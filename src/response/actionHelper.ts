// 动作统一辅助方法，减少各 response 模块对 redis key / JSON 解析的重复代码
import { getJSON, setValue, userKey } from '@src/model/utils/redisHelper'

// 约定：字符串 '0' 表示开启中的状态；'1' 表示关闭或空闲（保持与现有代码一致）
export interface ActionRecord {
  action: string // 动作名称
  end_time: number // 截止时间戳 (ms)
  time: number // 持续时长 (ms)
  // 下面是各类状态开关，历史代码中使用字符串 '0' | '1'
  plant?: '0' | '1'
  shutup?: '0' | '1'
  working?: '0' | '1'
  Place_action?: '0' | '1'
  Place_actionplus?: '0' | '1'
  power_up?: '0' | '1'
  mojie?: '0' | '1'
  xijie?: '0' | '1'
  mine?: '0' | '1'
  cishu?: number
  group_id?: string
  // 位置/秘境等扩展信息
  Place_address?: unknown
  // 允许额外字段（保持兼容），使用 unknown 再在使用点断言
  [k: string]: unknown
}

// 默认动作 key；支持自定义 suffix 以兼容特殊场景（如锻造使用 action10）
export function actionRedisKey(userId: string | number, suffix = 'action') {
  return userKey(userId, suffix)
}

export async function readAction(userId: string | number) {
  return getJSON<ActionRecord>(actionRedisKey(userId))
}

export async function readActionWithSuffix(
  userId: string | number,
  suffix: string
) {
  return getJSON<ActionRecord>(actionRedisKey(userId, suffix))
}

export async function writeAction(
  userId: string | number,
  record: ActionRecord
) {
  await setValue(actionRedisKey(userId), record)
}

export async function writeActionWithSuffix(
  userId: string | number,
  suffix: string,
  record: ActionRecord
) {
  await setValue(actionRedisKey(userId, suffix), record)
}

export function isActionRunning(
  record: ActionRecord | null | undefined,
  now = Date.now()
) {
  if (!record) return false
  return now <= record.end_time
}

// 通用启动：传入动作名与持续时长（毫秒）以及附加 flag
export async function startAction(
  userId: string | number,
  name: string,
  durationMs: number,
  flags: Partial<ActionRecord>
) {
  return startActionWithSuffix(userId, 'action', name, durationMs, flags)
}

export async function startActionWithSuffix(
  userId: string | number,
  suffix: string,
  name: string,
  durationMs: number,
  flags: Partial<ActionRecord>
) {
  const now = Date.now()
  const record: ActionRecord = {
    action: name,
    end_time: now + durationMs,
    time: durationMs,
    ...flags
  }
  await writeActionWithSuffix(userId, suffix, record)
  return record
}

// 便捷：闭关动作（默认 30 分钟，向上取 30 的倍数，最大 30*240）
export function normalizeBiguanMinutes(raw: number | undefined): number {
  const DEFAULT_MIN = 30
  const STEP = 30
  const MAX_MULTIPLIER = 240 // 与旧逻辑一致（30 * 240 分）
  if (!raw || Number.isNaN(raw)) return DEFAULT_MIN
  let m = Math.max(raw, DEFAULT_MIN)
  // 向下对齐到 STEP 的倍数但不超过最大
  for (let i = MAX_MULTIPLIER; i > 0; i--) {
    if (m >= STEP * i) {
      m = STEP * i
      break
    }
  }
  return m
}

// 通用分钟归一：
// raw 任意输入；step 步长；loops 最大循环次数（决定最大 = step * loops）；min 最小值
export function normalizeDurationMinutes(
  raw: unknown,
  step: number,
  loops: number,
  min: number
): number {
  const parsed = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw)
  if (Number.isNaN(parsed)) return min
  let m = parsed
  const max = step * loops
  if (m > max) m = max
  for (let i = loops; i > 0; i--) {
    if (m >= step * i) {
      m = step * i
      break
    }
  }
  if (m < min) m = min
  return m
}

// 计算剩余毫秒
export function remainingMs(record: ActionRecord, now = Date.now()): number {
  return Math.max(0, record.end_time - now)
}

// 格式化剩余 mm分ss秒
export function formatRemaining(ms: number) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total - m * 60
  return `${m}分${s}秒`
}

// 通用更新：传入回调，回调返回新的记录（或 null 代表不更新）
export async function updateAction(
  userId: string | number,
  updater: (prev: ActionRecord | null) => ActionRecord | null
) {
  const prev = await readAction(userId)
  const next = updater(prev)
  if (next) await writeAction(userId, next)
  return next
}

export async function updateActionWithSuffix(
  userId: string | number,
  suffix: string,
  updater: (prev: ActionRecord | null) => ActionRecord | null
) {
  const prev = await readActionWithSuffix(userId, suffix)
  const next = updater(prev)
  if (next) await writeActionWithSuffix(userId, suffix, next)
  return next
}

// 提前结束当前动作（若存在），可附加额外字段覆盖；返回更新后的记录
export async function stopAction(
  userId: string | number,
  extra: Partial<ActionRecord & { [k: string]: unknown }> = {}
) {
  return updateAction(userId, prev => {
    if (!prev) return null
    return {
      ...prev,
      end_time: Date.now(),
      ...extra
    }
  })
}

export async function stopActionWithSuffix(
  userId: string | number,
  suffix: string,
  extra: Partial<ActionRecord & { [k: string]: unknown }> = {}
) {
  return updateActionWithSuffix(userId, suffix, prev => {
    if (!prev) return null
    return {
      ...prev,
      end_time: Date.now(),
      ...extra
    }
  })
}
