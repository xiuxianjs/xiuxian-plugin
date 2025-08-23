import { Image, useSend, Text } from 'alemonjs'

import { selects } from '@src/response/mw'
import { getXianChongImage } from '@src/model/image'
import { existplayer } from '@src/model/index'
import { redis } from '@src/model/api'
import { getRedisKey } from '@src/model/keys'

export const regular = /^(#|＃|\/)?仙宠楼$/

const CD_MS = 10 * 1000
function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const cdKey = getRedisKey(usr_qq, 'petShowCD')
  const now = Date.now()
  const last = toInt(await redis.get(cdKey))
  if (now < last + CD_MS) {
    Send(
      Text(`查看过于频繁，请${Math.ceil((last + CD_MS - now) / 1000)}秒后再试`)
    )
    return false
  }
  await redis.set(cdKey, String(now))

  const evt = e as import('alemonjs').EventsMessageCreateEnum
  const img = await getXianChongImage(evt)
  if (!img) {
    Send(Text('生成图片失败，请稍后再试'))
    return false
  }
  const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img)
  Send(Image(buffer))
  return false
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
