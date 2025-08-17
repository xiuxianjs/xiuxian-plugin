import { Image, useSend, Text } from 'alemonjs'
import type { EventsMessageCreateEnum } from 'alemonjs'

import { existplayer } from '@src/model/index'
import { redis } from '@src/model/api'
import { selects } from '@src/response/index'
import { getNajieImage } from '@src/model/image'
import { getRedisKey } from '@src/model/key'
export const regular = /^(#|＃|\/)?我的纳戒$/

function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

const CD_MS = 10 * 1000 // 10秒冷却，避免频繁截图占用资源

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  // 冷却判断
  const cdKey = getRedisKey(usr_qq, 'showNajieCD')
  const lastTs = toInt(await redis.get(cdKey))
  const now = Date.now()
  if (now < lastTs + CD_MS) {
    const remain = lastTs + CD_MS - now
    const s = Math.ceil(remain / 1000)
    Send(Text(`请求过于频繁，请${s}秒后再试`))
    return false
  }
  await redis.set(cdKey, String(now))

  const publicEvent = e as EventsMessageCreateEnum
  const img = await getNajieImage(publicEvent)
  if (!img) {
    Send(Text('纳戒信息生成失败，请稍后重试'))
    return false
  }
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
    return false
  }
  Send(Text('图片加载失败'))
  return false
})
