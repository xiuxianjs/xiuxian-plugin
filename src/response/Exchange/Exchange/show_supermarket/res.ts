import { Image, useSend, Text } from 'alemonjs'

import { selects } from '@src/response/index'
import { getSupermarketImage } from '@src/model/image'
import { existplayer } from '@src/model/index'
import { redis } from '@src/model/api'
import type { NajieCategory } from '@src/types/model'

export const regular = /^(#|＃|\/)?冲水堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/

const VALID: ReadonlyArray<NajieCategory> = [
  '装备',
  '丹药',
  '功法',
  '道具',
  '草药',
  '仙宠',
  '材料'
]
const CD_MS = 10 * 1000
function toInt(v: unknown, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const cdKey = `xiuxian@1.3.0:${usr_qq}:supermarketCD`
  const now = Date.now()
  const lastTs = toInt(await redis.get(cdKey))
  if (now < lastTs + CD_MS) {
    Send(
      Text(
        `查看过于频繁，请${Math.ceil((lastTs + CD_MS - now) / 1000)}秒后再试`
      )
    )
    return false
  }
  await redis.set(cdKey, String(now))

  const raw = e.MessageText.replace(/^(#|＃|\/)?冲水堂/, '').trim()
  const cate = VALID.find(v => v === raw) || undefined
  if (raw && !cate) {
    Send(Text('类别无效，可选: ' + VALID.join('/')))
    return false
  }

  const evt = e as import('alemonjs').EventsMessageCreateEnum
  const img = await getSupermarketImage(evt, cate)
  if (!img) {
    Send(Text('生成列表失败，请稍后再试'))
    return false
  }
  const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img)
  Send(Image(buffer))
  return false
})
