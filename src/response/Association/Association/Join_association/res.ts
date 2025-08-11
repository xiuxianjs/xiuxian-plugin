import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  notUndAndNull,
  timestampToTime,
  playerEfficiency
} from '@src/model/index'
import type { AssociationDetailData, Player, JSONValue } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?加入宗门.*$/

const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]

interface GuildInfo extends AssociationDetailData {
  宗门等级?: number
  所有成员?: string[]
  外门弟子?: string[]
}
function isGuildInfo(v: unknown): v is GuildInfo {
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

interface PlayerGuildEntry {
  宗门名称: string
  职位: string
  time?: [string, number]
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = (await data.getData('player', usr_qq)) as Player | null
  if (!player) return false
  if (notUndAndNull(player.宗门)) return false
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  const levelEntry = data.Level_list.find(
    item => item.level_id == player.level_id
  )
  if (!levelEntry) {
    Send(Text('境界数据缺失'))
    return false
  }
  const now_level_id = levelEntry.level_id
  const association_name = e.MessageText.replace(
    /^(#|＃|\/)?加入宗门/,
    ''
  ).trim()
  if (!association_name) {
    Send(Text('请输入宗门名称'))
    return false
  }
  const ifexistass = await data.existData('association', association_name)
  if (!ifexistass) {
    Send(Text('这方天地不存在' + association_name))
    return false
  }
  const assRaw = await data.getAssociation(association_name)
  if (assRaw === 'error') {
    Send(Text('没有这个宗门'))
    return false
  }
  if (!isGuildInfo(assRaw)) {
    Send(Text('宗门数据格式错误'))
    return false
  }
  const ass = assRaw as GuildInfo
  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : []
  ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : []
  const guildLevel = Number(ass.宗门等级 ?? 1)

  if (now_level_id >= 42 && ass.power == 0) {
    Send(Text('仙人不可下界！'))
    return false
  }
  if (now_level_id < 42 && ass.power == 1) {
    Send(Text('你在仙界吗？就去仙界宗门'))
    return false
  }

  if (Number(ass.最低加入境界 || 0) > now_level_id) {
    const level =
      data.Level_list.find(item => item.level_id === ass.最低加入境界)?.level ||
      '未知境界'
    Send(
      Text(
        `${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`
      )
    )
    return false
  }
  const capIndex = Math.max(
    0,
    Math.min(宗门人数上限.length - 1, guildLevel - 1)
  )
  const mostmem = 宗门人数上限[capIndex]
  const nowmem = ass.所有成员.length
  if (mostmem <= nowmem) {
    Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`))
    return false
  }
  const nowTime = Date.now()
  const date = timestampToTime(nowTime)
  player.宗门 = {
    宗门名称: association_name,
    职位: '外门弟子',
    time: [date, nowTime]
  } as PlayerGuildEntry
  ass.所有成员.push(usr_qq)
  ass.外门弟子.push(usr_qq)
  await playerEfficiency(usr_qq)
  await data.setData('player', usr_qq, serializePlayer(player))
  await data.setAssociation(association_name, ass)
  Send(Text(`恭喜你成功加入${association_name}`))
})
