import { Image, useSend, Text } from 'alemonjs'
import { selects } from '@src/response/mw'
import { getForumImage } from '@src/model/image'
import { existplayer } from '@src/model/index'
import { redis } from '@src/model/api'
import type { NajieCategory } from '@src/types/model'
import { getRedisKey } from '@src/model/keys'

export const regular = /^(#|＃|\/)?聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/

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
function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const cdKey = getRedisKey(usr_qq, 'forumShowCD')
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

  const raw = e.MessageText.replace(/^(#|＃|\/)?聚宝堂/, '').trim()
  const cate = VALID.find(v => v === raw) || undefined
  if (raw && !cate) {
    Send(Text('类别无效，可选: ' + VALID.join('/')))
    return false
  }

  const evt = e as import('alemonjs').EventsMessageCreateEnum
  const img = await getForumImage(evt, cate)
  if (!img) {
    Send(Text('生成列表失败，请稍后再试'))
    return false
  }
  const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img)
  Send(Image(buffer))
  return false
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
