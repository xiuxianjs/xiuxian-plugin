import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull, playerEfficiency } from '@src/model/index'
import type { AssociationDetailData, Player, JSONValue } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?逐出.*$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  所有成员?: string[]
  [k: string]: any
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

  const member_qq = e.MessageText.replace(/^(#|＃|\/)?逐出/, '').trim()
  if (!member_qq) {
    Send(Text('请输入要逐出成员的QQ'))
    return false
  }
  if (usr_qq === member_qq) {
    Send(Text('不能踢自己'))
    return false
  }
  if (!(await data.existData('player', member_qq))) {
    Send(Text('此人未踏入仙途！'))
    return false
  }
  const playerB = (await data.getData('player', member_qq)) as Player | null
  if (
    !playerB ||
    !notUndAndNull(playerB.宗门) ||
    !isPlayerGuildRef(playerB.宗门)
  ) {
    Send(Text('对方尚未加入宗门'))
    return false
  }
  const assRaw = await data.getAssociation(player.宗门.宗门名称)
  const bssRaw = await data.getAssociation(playerB.宗门.宗门名称)
  if (
    assRaw === 'error' ||
    bssRaw === 'error' ||
    !isExtAss(assRaw) ||
    !isExtAss(bssRaw)
  )
    return false
  const ass = assRaw
  const bss = bssRaw
  if (ass.宗门名称 !== bss.宗门名称) return false

  const actorRole = player.宗门.职位
  const targetRole = playerB.宗门.职位
  const removeMember = () => {
    const roleList = (bss as Record<string, unknown>)[targetRole]
    if (Array.isArray(roleList)) {
      ;(bss as Record<string, unknown>)[targetRole] = roleList.filter(
        q => q !== member_qq
      )
    }
    bss.所有成员 = Array.isArray(bss.所有成员)
      ? bss.所有成员.filter(q => q !== member_qq)
      : []
    delete (playerB as Player & { 宗门? }).宗门
  }

  if (actorRole === '宗主') {
    removeMember()
    await data.setAssociation(bss.宗门名称, bss)
    await data.setData('player', member_qq, serializePlayer(playerB))
    await playerEfficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  if (actorRole === '副宗主') {
    if (targetRole === '宗主') {
      Send(Text('你没权限'))
      return false
    }
    if (targetRole === '长老' || targetRole === '副宗主') {
      Send(Text(`宗门${targetRole}任免请上报宗主！`))
      return false
    }
    removeMember()
    await data.setAssociation(bss.宗门名称, bss)
    await data.setData('player', member_qq, serializePlayer(playerB))
    await playerEfficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  if (actorRole === '长老') {
    if (targetRole === '宗主' || targetRole === '副宗主') {
      Send(Text('造反啦？'))
      return false
    }
    if (targetRole === '长老') {
      Send(Text(`宗门${targetRole}任免请上报宗主！`))
      return false
    }
    removeMember()
    await data.setAssociation(bss.宗门名称, bss)
    await data.setData('player', member_qq, serializePlayer(playerB))
    await playerEfficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  // 其它身份无权限
  return false
})
