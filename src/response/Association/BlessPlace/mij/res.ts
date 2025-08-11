import { Text, useSend } from 'alemonjs'
import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'
import type { NamedItem } from '@src/types'

export const regular = /^(#|＃|\/)?宗门秘境$/

interface GuildSecret {
  name: string
  Price?: number
}
function isGuildSecret(v: unknown): v is GuildSecret {
  return !!v && typeof v === 'object' && 'name' in v
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const raw = data.guildSecrets_list as unknown
  const list: GuildSecret[] = Array.isArray(raw)
    ? raw.filter(isGuildSecret)
    : []
  if (!list.length) {
    Send(Text('暂无宗门秘境配置'))
    return false
  }
  const namedList: NamedItem[] = list.map(i => ({ name: i.name }))
  await Goweizhi(
    e as unknown as import('alemonjs').EventsMessageCreateEnum,
    namedList
  )
  return false
})
