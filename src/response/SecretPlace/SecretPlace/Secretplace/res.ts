import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/mw'
import { existplayer } from '@src/model/index'
import type { NamedItem } from '@src/types/model'

export const regular = /^(#|＃|\/)?秘境$/
export default onResponse(selects, async e => {
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  const weizhi = (data.didian_list || []) as NamedItem[]
  if (!Array.isArray(weizhi) || weizhi.length === 0) return false
  const pubEvent = e as import('alemonjs').EventsMessageCreateEnum
  await Goweizhi(pubEvent, weizhi)
  return false
})
