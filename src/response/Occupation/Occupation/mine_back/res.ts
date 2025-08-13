import { redis } from '@src/model/api'
import { getPlayerAction } from '@src/model/index'
import { mine_jiesuan } from '../../api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?结束采矿$/

interface PlayerAction {
  action: string
  mine?: number
  end_time?: number // 结束时间戳(ms)
  time?: number // 持续时长(ms)
  start?: number // 兼容另一种结构: 开始时间
  duration?: number // 兼容: 持续时长
  is_jiesuan?: number
  plant?: number
  shutup?: number
  working?: number
  power_up?: number
  Place_action?: number
  group_id?: string
  [k: string]: any
}

const BLOCK_MINUTES = 30 // 满 30 分钟结算一个周期
const MAX_BLOCKS = 24 // 最多 24 个周期 (12 小时)

function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

function normalizeAction(raw): PlayerAction {
  if (!raw || typeof raw !== 'object') {
    return { action: '空闲' }
  }
  const r = raw as Record<string, unknown>
  const action: PlayerAction = {
    action: typeof r.action === 'string' ? r.action : '空闲',
    mine: toInt(r.mine, undefined as number),
    end_time: toInt(r.end_time, undefined as number),
    time: toInt(r.time, undefined as number),
    start: toInt(r.start, undefined as number),
    duration: toInt(r.duration, undefined as number),
    is_jiesuan: toInt(r.is_jiesuan, undefined as number),
    plant: toInt(r.plant, undefined as number),
    shutup: toInt(r.shutup, undefined as number),
    working: toInt(r.working, undefined as number),
    power_up: toInt(r.power_up, undefined as number),
    Place_action: toInt(r.Place_action, undefined as number),
    group_id: typeof r.group_id === 'string' ? r.group_id : undefined
  }
  // 将非法 0 视为未设置
  if (!action.end_time) delete action.end_time
  if (!action.time) delete action.time
  if (!action.start) delete action.start
  if (!action.duration) delete action.duration
  return action
}

// 计算可结算分钟(按 30 分钟为一个周期取整; 未满首个周期视为 0)
function calcEffectiveMinutes(act: PlayerAction, now: number): number {
  // 优先使用 (end_time,time) 结构; 否则使用 (start,duration)
  let startMs: number | undefined
  let durationMs: number | undefined
  if (act.end_time && act.time) {
    durationMs = act.time
    startMs = act.end_time - act.time
  } else if (act.start && act.duration) {
    startMs = act.start
    durationMs = act.duration
  }
  if (!startMs || !durationMs) return 0

  const endMs = startMs + durationMs
  const elapsed = endMs > now ? Math.max(0, now - startMs) : durationMs
  const minutes = Math.floor(elapsed / 60000)
  if (minutes < BLOCK_MINUTES) return 0
  const blocks = Math.min(MAX_BLOCKS, Math.floor(minutes / BLOCK_MINUTES))
  return blocks * BLOCK_MINUTES
}

export default onResponse(selects, async e => {
  const raw = await getPlayerAction(e.UserId)
  const action = normalizeAction(raw)
  if (action.action === '空闲') return false
  if (action.mine === 1) return false

  const now = Date.now()
  const minutes = calcEffectiveMinutes(action, now)

  if (e.name === 'message.create') {
    await mine_jiesuan(e.UserId, minutes, e.ChannelId)
  } else {
    await mine_jiesuan(e.UserId, minutes)
  }

  // 标记结束; 统一写入 end_time/time 结构方便后续命令
  action.is_jiesuan = 1
  action.mine = 1
  action.plant = 1
  action.shutup = 1
  action.working = 1
  action.power_up = 1
  action.Place_action = 1
  action.end_time = now
  action.time =
    (action.time && action.end_time && action.time) ||
    action.duration ||
    minutes * 60000 // 记录原始或推导时长
  delete action.group_id

  await redis.set(`xiuxian@1.3.0:${e.UserId}:action`, JSON.stringify(action))
  return false
})
