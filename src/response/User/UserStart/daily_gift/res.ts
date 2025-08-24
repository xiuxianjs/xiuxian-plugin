import { Text, useSend } from 'alemonjs'

import { redis, data } from '@src/model/api'
import {
  existplayer,
  shijianc,
  getLastsign,
  addNajieThing,
  addExp,
  writePlayer,
  getConfig
} from '@src/model/index'

import { selects } from '@src/response/mw'
import type { Player } from '@src/types'
import { getRedisKey } from '@src/model/keys'
export const regular = /^(#|＃|\/)?修仙签到$/

interface LastSignStruct {
  Y: number
  M: number
  D: number
}
interface SignConfig {
  Sign?: { ticket?: number }
}
function isLastSignStruct(v): v is LastSignStruct {
  if (!v || typeof v !== 'object') return false
  const obj = v
  return (
    typeof obj.Y === 'number' &&
    typeof obj.M === 'number' &&
    typeof obj.D === 'number'
  )
}
const isSameDay = (a: LastSignStruct, b: LastSignStruct) =>
  a.Y === b.Y && a.M === b.M && a.D === b.D

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const nowTime = Date.now()
  const yesterdayStruct = await shijianc(nowTime - 24 * 60 * 60 * 1000)
  const todayStruct = await shijianc(nowTime)
  const lastSignStruct = await getLastsign(usr_qq)

  if (
    isLastSignStruct(lastSignStruct) &&
    isLastSignStruct(todayStruct) &&
    isSameDay(todayStruct, lastSignStruct)
  ) {
    Send(Text('今日已经签到过了'))
    return false
  }
  const continued =
    isLastSignStruct(lastSignStruct) &&
    isLastSignStruct(yesterdayStruct) &&
    isSameDay(yesterdayStruct, lastSignStruct)

  await redis.set(getRedisKey(usr_qq, 'lastsign_time'), String(nowTime))

  const player = (await data.getData('player', usr_qq)) as Player | null
  if (!player) {
    Send(Text('玩家数据异常'))
    return false
  }
  const record = player as { [key: string]: any; 连续签到天数?: number }
  let currentStreak = 0
  const rawStreak = record['连续签到天数']
  if (typeof rawStreak === 'number' && Number.isFinite(rawStreak))
    currentStreak = rawStreak
  let newStreak = currentStreak === 7 || !continued ? 0 : currentStreak
  newStreak += 1
  record.连续签到天数 = newStreak

  await writePlayer(usr_qq, player)

  const cf = (await getConfig('xiuxian', 'xiuxian')) as SignConfig | undefined
  const ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0))
  const gift_xiuwei = newStreak * 3000
  if (ticketNum > 0) await addNajieThing(usr_qq, '秘境之匙', '道具', ticketNum)
  await addExp(usr_qq, gift_xiuwei)

  Send(
    Text(
      `已经连续签到${newStreak}天，获得修为${gift_xiuwei}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''}`
    )
  )
  return false
})

import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
