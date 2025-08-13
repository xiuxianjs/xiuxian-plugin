import { Text, useSend } from 'alemonjs'

import { config, data } from '@src/model/api'
import { notUndAndNull, shijianc } from '@src/model/index'
import type { AssociationDetailData, Player, JSONValue } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  维护时间?: number
  灵石池?: number
  宗门等级?: number
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
  if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门))
    return false
  if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'))
    return false
  }
  const assRaw = await data.getAssociation(player.宗门.宗门名称)
  if (assRaw === 'error' || !isExtAss(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const ass = assRaw
  const nowTime = Date.now()
  const cfg = config.getConfig('xiuxian', 'xiuxian')
  const time = cfg.CD.association
  const lastMaintain = Number(ass.维护时间 || 0)
  const nextMaintainTs = lastMaintain + 60000 * time
  if (lastMaintain && lastMaintain > nowTime - 1000 * 60 * 60 * 24 * 7) {
    const nextmt_time = await shijianc(nextMaintainTs)
    Send(
      Text(
        `当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
      )
    )
    return false
  }
  const level = Number(ass.宗门等级 || 1)
  const pool = Number(ass.灵石池 || 0)
  const need = level * 50000
  if (pool < need) {
    Send(Text(`目前宗门维护需要${need}灵石,本宗门灵石池储量不足`))
    return false
  }
  ass.灵石池 = pool - need
  ass.维护时间 = nowTime
  await data.setAssociation(ass.宗门名称, ass)
  await data.setData('player', usr_qq, serializePlayer(player))
  const nextmt_time = await shijianc(ass.维护时间 + 60000 * time)
  Send(
    Text(
      `宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
    )
  )
  return false
})
