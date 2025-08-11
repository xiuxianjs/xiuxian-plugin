import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'
import { existplayer } from '@src/model/index'
import type { NamedItem } from '@src/types/model'

export const regular = /^(#|＃|\/)?仙境$/
export default onResponse(selects, async e => {
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  const list = (data.Fairyrealm_list || []) as NamedItem[]
  if (!Array.isArray(list) || list.length === 0) return false
  await Goweizhi(e as import('alemonjs').EventsMessageCreateEnum, list)
  return false
})
