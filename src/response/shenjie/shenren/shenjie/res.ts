import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  shijianc,
  writePlayer
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?踏入神界$/

interface ActionState {
  action: string
  end_time: number
  time: number
  shutup?: string
  working?: string
  Place_action?: string
  mojie?: string
  Place_actionplus?: string
  power_up?: string
  xijie?: string
  plant?: string
  mine?: string
  cishu?: string | number
  group_id?: string
}
interface DayInfo {
  Y: number
  M: number
  D: number
}

function toInt(v, def = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.floor(n) : def
}
function parseJSON<T>(raw): T | null {
  try {
    if (typeof raw === 'string' && raw.trim()) return JSON.parse(raw) as T
  } catch {
    /* ignore */
  }
  return null
}
function isDayChanged(a: DayInfo | null, b: DayInfo | null): boolean {
  if (!a || !b) return true
  return a.Y !== b.Y || a.M !== b.M || a.D !== b.D
}

const LS_COST = 2_200_000
const DURATION_MINUTES = 30
import { getRedisKey } from '@src/model/keys'

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  // 全局娱乐占用状态
  const gameActionRaw = await redis.get(getRedisKey(usr_qq, 'game_action'))
  if (toInt(gameActionRaw) === 1) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }

  // 当前动作占用
  const actionRaw = await redis.get(getRedisKey(usr_qq, 'action'))
  const actionObj = parseJSON<ActionState>(actionRaw)
  if (actionObj && toInt(actionObj.end_time) > Date.now()) {
    const remain = actionObj.end_time - Date.now()
    const m = Math.trunc(remain / 60000)
    const s = Math.trunc((remain % 60000) / 1000)
    Send(Text(`正在${actionObj.action}中, 剩余时间: ${m}分${s}秒`))
    return false
  }

  let player = await readPlayer(usr_qq)
  if (!player) return false

  const now = Date.now()
  const today = (await shijianc(now)) as DayInfo
  const lastTimeRaw = await redis.get(getRedisKey(usr_qq, 'lastdagong_time'))
  const lastDay = lastTimeRaw
    ? ((await shijianc(toInt(lastTimeRaw))) as DayInfo)
    : null

  // 每日刷新神界次数：逻辑修正为任一日期字段变化即刷新
  if (isDayChanged(today, lastDay)) {
    await redis.set(getRedisKey(usr_qq, 'lastdagong_time'), now)
    let n = 1
    const ln = player.灵根?.name
    if (ln === '二转轮回体') n = 2
    else if (ln === '三转轮回体' || ln === '四转轮回体') n = 3
    else if (ln === '五转轮回体' || ln === '六转轮回体') n = 4
    else if (ln === '七转轮回体' || ln === '八转轮回体') n = 4
    else if (ln === '九转轮回体') n = 5
    player.神界次数 = n
    await writePlayer(usr_qq, player)
  }

  player = await readPlayer(usr_qq)
  if (!player) return false

  // 资格校验
  if (
    toInt(player.魔道值) > 0 ||
    (player.灵根?.type !== '转生' && toInt(player.level_id) < 42)
  ) {
    Send(Text('你没有资格进入神界'))
    return false
  }
  if (toInt(player.灵石) < LS_COST) {
    Send(Text('灵石不足'))
    return false
  }

  player.灵石 = toInt(player.灵石) - LS_COST
  const todayRef = (await shijianc(now)) as DayInfo // 重新拿一次防止 race（可选）
  const lastDayRefRaw = await redis.get(getRedisKey(usr_qq, 'lastdagong_time'))
  const lastDayRef = lastDayRefRaw
    ? ((await shijianc(toInt(lastDayRefRaw))) as DayInfo)
    : null
  if (!isDayChanged(todayRef, lastDayRef) && toInt(player.神界次数) === 0) {
    Send(Text('今日次数用光了,请明日再来吧'))
    return false
  }
  player.神界次数 = Math.max(0, toInt(player.神界次数) - 1)
  await writePlayer(usr_qq, player)

  const durationMs = DURATION_MINUTES * 60000
  const newAction: ActionState = {
    action: '神界',
    end_time: Date.now() + durationMs,
    time: durationMs,
    shutup: '1',
    working: '1',
    Place_action: '1',
    mojie: '-1',
    Place_actionplus: '1',
    power_up: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    cishu: '5'
  }
  if (e.name === 'message.create') newAction.group_id = e.ChannelId
  await redis.set(getRedisKey(usr_qq, 'action'), JSON.stringify(newAction))
  Send(Text(`开始进入神界, ${DURATION_MINUTES}分钟后归来!`))
  return false
})

import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
