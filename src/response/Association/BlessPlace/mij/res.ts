import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'
import type { NamedItem } from '@src/types'

export const regular = /^(#|＃|\/)?宗门秘境$/

export default onResponse(selects, async e => {
  const raw = data.guildSecrets_list as unknown
  await Goweizhi(
    e as unknown as import('alemonjs').EventsMessageCreateEnum,
    raw as NamedItem[]
  )
  return false
})
