// 通用玩家状态与工具函数抽离
import { useSend, Text, PublicEventMessageCreate } from 'alemonjs'
import { getDataByUserId } from './Redis.js'
import { safeParse } from './utils/safe.js'

export function getRandomFromARR<T = any>(ARR: T[]): T {
  const randindex = Math.trunc(Math.random() * ARR.length)
  return ARR[randindex]
}

export async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export function timestampToTime(timestamp: number) {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D + h + m + s
}

export async function shijianc(time: number) {
  const date = new Date(time)
  return {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
}

export async function getLastsign(usr_qq: string) {
  const time: any = await getDataByUserId(usr_qq, 'lastsign_time')
  if (time != null) return await shijianc(parseInt(time))
  return false
}

export async function getPlayerAction(usr_qq: string) {
  const arr: any = {}
  let action: any = await getDataByUserId(usr_qq, 'action')
  action = safeParse(action, null)
  if (action != null) {
    arr.action = action.action
    arr.time = action.time
    arr.end_time = action.end_time
    arr.plant = action.plant
    arr.mine = action.mine
    return arr
  }
  arr.action = '空闲'
  return arr
}

export async function dataverification(e: PublicEventMessageCreate) {
  if (e.name !== 'message.create') return 1
  const usr_qq = e.UserId
  const { existplayer } = await import('./xiuxian.js')
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return 1
  return 0
}

export function notUndAndNull(obj: any): boolean {
  return !(obj == undefined || obj == null)
}

export function isNotBlank(value: any): boolean {
  return value ?? '' !== ''
}

export async function Go(e: PublicEventMessageCreate) {
  const usr_qq = e.UserId
  const Send = useSend(e)
  const { existplayer } = await import('./xiuxian.js')
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return 0
  const game_action: any = await getDataByUserId(usr_qq, 'game_action')
  if (game_action == 1) {
    Send(Text('修仙：游戏进行中...'))
    return 0
  }
  let action: any = await getDataByUserId(usr_qq, 'action')
  action = safeParse(action, null)
  if (action != null) {
    const action_end_time = action.end_time
    const now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60)
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return 0
    }
  }
  return true
}

import { convert2integer } from './utils/number.js'
export { convert2integer } // 供按需具名导入使用

export default {
  getRandomFromARR,
  sleep,
  timestampToTime,
  shijianc,
  getLastsign,
  getPlayerAction,
  dataverification,
  notUndAndNull,
  isNotBlank,
  Go,
  convert2integer
}
