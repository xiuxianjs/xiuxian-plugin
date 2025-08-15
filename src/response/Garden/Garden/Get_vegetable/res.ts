import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/model/api'
import { addNajieThing } from '@src/model/index'
import type { AssociationData } from '@src/types/domain'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?拔苗助长.*$/

// 数值安全转换
function toInt(v, def = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.floor(n) : def
}
function formatRemain(ms: number) {
  if (ms <= 0) return '0分0秒'
  const m = Math.trunc(ms / 60000)
  const s = Math.trunc((ms % 60000) / 1000)
  return `${m}分${s}秒`
}
interface PlayerWithGuild {
  名号?: string
  宗门?: { 宗门名称: string }
}
interface GardenCrop {
  name: string
  ts?: number
  start_time?: number
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await data.existData('player', usr_qq))) return false
  const player = (await data.getData(
    'player',
    usr_qq
  )) as PlayerWithGuild | null
  const guildName = player?.宗门?.宗门名称
  if (!guildName) return false

  const ass = (await data.getAssociation(guildName)) as AssociationData
  // 兼容药园结构（可能未定义）
  const gardenAny = ass['药园'] as Record<string, unknown> | undefined
  const garden = gardenAny as
    | { 药园等级?: number; 作物?: GardenCrop[] }
    | undefined
  if (!garden || toInt(garden.药园等级) <= 1) {
    Send(Text('药园等级太低，可远观不可亵玩焉'))
    return false
  }

  // 冷却
  const cdMinutes = toInt(config.getConfig('xiuxian', 'xiuxian')?.CD?.garden)
  const cdMs = cdMinutes * 60000
  const now = Date.now()
  const lastKey = `xiuxian@1.3.0:${usr_qq}:last_garden_time`
  const lastTime = toInt(await redis.get(lastKey))
  const remain = lastTime + cdMs - now
  if (cdMs > 0 && remain > 0) {
    Send(Text(`每${cdMinutes}分钟拔苗一次。cd: ${formatRemain(remain)}`))
    return false
  }

  // 解析作物名称（允许有空格）
  const rawName = e.MessageText.replace(/^(#|＃|\/)?拔苗助长/, '').trim()
  if (!rawName) {
    Send(Text('请输入要拔苗助长的作物名称'))
    return false
  }
  console.log(rawName)

  const crops = Array.isArray(garden.作物) ? garden.作物 : []
  const targetIndex = crops.findIndex(c => c?.name === rawName)
  if (targetIndex === -1) {
    Send(Text('您拔错了吧！掣电树chedianshu'))
    await redis.set(lastKey, now) // 仍记录冷却，避免刷词
    return false
  }
  const crop = crops[targetIndex]
  const ts = toInt(crop.ts, 1) // ts: 成熟周期系数（天）

  // 作物成熟时间戳 key
  const matureKey = `xiuxian:${ass.宗门名称}${rawName}`
  let matureAt = toInt(await redis.get(matureKey), 0)
  if (matureAt === 0) {
    // 若无记录，初始化一个完整周期（回填 start_time）
    matureAt = now + 24 * 60 * 60 * 1000 * ts
    crop.start_time = now
    await redis.set(matureKey, matureAt)
    // 写回
    await data.setAssociation(ass.宗门名称, ass)
  }

  // 如果预计成熟还大于 30 分钟，则可加速：减少 30 分钟
  const accelerate = 30 * 60 * 1000
  if (now + accelerate < matureAt) {
    matureAt -= accelerate
    await redis.set(matureKey, matureAt)
    await redis.set(lastKey, now)
    const remainAfter = matureAt - now
    Send(
      Text(
        `作物${rawName}加速成功，减少1800000成熟度，剩余${remainAfter}成熟度`
      )
    )
    return false
  }

  // 否则视为已成熟 -> 采摘
  Send(
    Text(
      `作物${rawName}已成熟，被${usr_qq}${player?.名号 || ''}摘取, 放入纳戒了`
    )
  )
  await addNajieThing(usr_qq, rawName, '草药', 1)
  const nextMature = now + 24 * 60 * 60 * 1000 * ts
  crop.start_time = now
  await data.setAssociation(ass.宗门名称, ass)
  await Promise.all([redis.set(matureKey, nextMature), redis.set(lastKey, now)])
  return false
})
