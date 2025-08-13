import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model/index'
import type { AssociationDetailData, Player, JSONValue } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?建设宗门$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  宗门驻地?: string | number
  宗门建设等级?: number
  灵石池?: number
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v
}
function serializePlayer(p: Player): Record<string, JSONValue> {
  const r: Record<string, JSONValue> = {}
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'function') continue
    if (v && typeof v === 'object') r[k] = JSON.parse(JSON.stringify(v))
    else r[k] = v as JSONValue
  }
  return r
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await data.existData('player', usr_qq))) return false
  const player = (await data.getData('player', usr_qq)) as Player | null
  if (
    !player ||
    !notUndAndNull(player.宗门) ||
    !isPlayerGuildRef(player.宗门)
  ) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  // 可选：限制权限（只有宗主/副宗主/长老）
  if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
    Send(Text('权限不足'))
    return false
  }
  const assRaw = await data.getAssociation(player.宗门.宗门名称)
  if (assRaw === 'error' || !isExtAss(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const ass = assRaw
  if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
    Send(Text('你的宗门还没有驻地，无法建设宗门'))
    return false
  }
  let level = Number(ass.宗门建设等级 || 0)
  if (level < 0) level = 0
  ass.宗门建设等级 = level
  const pool = Math.max(0, Number(ass.灵石池 || 0))
  ass.灵石池 = pool
  const cost = Math.trunc(level * 10000)
  if (pool < cost) {
    Send(Text(`宗门灵石池不足，还需[${cost}]灵石`))
    return false
  }
  ass.灵石池 = pool - cost
  const add = Math.trunc(Number(player.level_id || 0) / 7) + 1
  ass.宗门建设等级 = level + add
  await data.setAssociation(ass.宗门名称, ass)
  await data.setData('player', usr_qq, serializePlayer(player))
  Send(
    Text(
      `成功消耗 宗门${cost}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`
    )
  )
  return false
})
