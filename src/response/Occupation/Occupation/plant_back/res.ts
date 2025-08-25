import { redis } from '@src/model/api'
import { getPlayerAction } from '@src/model/index'
import { plant_jiesuan, calcEffectiveMinutes } from '../../api'

import { selects } from '@src/response/mw'
import { getRedisKey } from '@src/model/keys'
export const regular = /^(#|＃|\/)?结束采药$/

interface PlantAction {
  action: string
  time: number
  end_time: number
  plant: number | string
  is_jiesuan?: number
  shutup?: number
  working?: number
  power_up?: number
  Place_action?: number
  group_id?: string
}

const res = onResponse(selects, async e => {
  const raw = (await getPlayerAction(e.UserId)) as unknown as PlantAction | null
  if (!raw) return false
  if (raw.action === '空闲') return false

  if (raw.plant === '1') return false

  // 若已结算（通过自定义 is_jiesuan 标志）直接返回
  if (raw.is_jiesuan === 1) return false

  const start_time = raw.end_time - raw.time
  const now = Date.now()
  const effective = calcEffectiveMinutes(start_time, raw.end_time, now)

  if (e.name === 'message.create')
    await plant_jiesuan(e.UserId, effective, e.ChannelId)
  else await plant_jiesuan(e.UserId, effective)

  const next: PlantAction = { ...raw }
  next.is_jiesuan = 1
  next.plant = 1
  next.shutup = 1
  next.working = 1
  next.power_up = 1
  next.Place_action = 1
  next.end_time = Date.now()
  delete next.group_id
  await redis.set(getRedisKey(e.UserId, 'action'), JSON.stringify(next))
  return false
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
