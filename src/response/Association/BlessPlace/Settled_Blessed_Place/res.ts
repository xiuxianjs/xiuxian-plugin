import { Text, useSend } from 'alemonjs'

import {
  __PATH,
  keysByPath,
  notUndAndNull,
  readPlayer,
  existplayer
} from '@src/model/index'
import Association from '@src/model/Association'
import { getDataList } from '@src/model/DataList'
import type { Player, AssociationDetailData } from '@src/types'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?入驻洞天.*$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  宗门驻地?: string
  宗门建设等级?: number
  大阵血量?: number
  所有成员?: string[]
  宗门名称: string
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v
}
interface BlessPlace {
  name: string
}
function isBlessPlace(v): v is BlessPlace {
  return !!v && typeof v === 'object' && 'name' in v
}

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  const player = (await readPlayer(usr_qq)) as Player | null
  if (
    !player ||
    !notUndAndNull(player.宗门) ||
    !isPlayerGuildRef(player.宗门)
  ) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (player.宗门.职位 !== '宗主') {
    Send(Text('只有宗主可以操作'))
    return false
  }

  const assRaw = await Association.getAssociation(player.宗门.宗门名称)
  if (assRaw === 'error' || !isExtAss(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const ass = assRaw

  const blessed_name = e.MessageText.replace(/^(#|＃|\/)?入驻洞天/, '').trim()
  if (!blessed_name) {
    Send(Text('请在指令后补充洞天名称'))
    return false
  }
  const blessRaw = await getDataList('Bless')
  const dongTan = blessRaw?.find(
    i => isBlessPlace(i) && i.name === blessed_name
  ) as BlessPlace | undefined
  if (!dongTan) {
    Send(Text('未找到该洞天'))
    return false
  }
  if (ass.宗门驻地 === dongTan.name) {
    Send(Text('该洞天已是你宗门的驻地'))
    return false
  }

  // 查询所有宗门，判断洞天是否被占据
  const guildNames = await keysByPath(__PATH.association)
  const assListRaw = await Promise.all(
    guildNames.map(n => Association.getAssociation(n))
  )
  for (const other of assListRaw) {
    if (other === 'error' || !isExtAss(other)) continue
    if (other.宗门名称 === ass.宗门名称) continue
    if (other.宗门驻地 !== dongTan.name) continue
    // 发生争夺
    const attackMembers = Array.isArray(ass.所有成员) ? ass.所有成员 : []
    const defendMembers = Array.isArray(other.所有成员) ? other.所有成员 : []

    let attackPower = 0
    for (const m of attackMembers) {
      const memberData = await readPlayer(m)
      const val = Math.trunc(memberData.攻击 + memberData.血量上限 * 0.5)
      attackPower += val
    }
    let defendPower = 0
    for (const m of defendMembers) {
      const memberData = await readPlayer(m)
      const val = Math.trunc(memberData.防御 + memberData.血量上限 * 0.5)
      defendPower += val
    }

    const randA = Math.random()
    const randB = Math.random()
    if (randA > 0.75) attackPower = Math.trunc(attackPower * 1.1)
    else if (randA < 0.25) attackPower = Math.trunc(attackPower * 0.9)
    if (randB > 0.75) defendPower = Math.trunc(defendPower * 1.1)
    else if (randB < 0.25) defendPower = Math.trunc(defendPower * 0.9)

    const ass阵血 = Math.max(0, Number(ass.大阵血量 || 0))
    const other阵血 = Math.max(0, Number(other.大阵血量 || 0))
    const ass建设 = Math.max(0, Number(ass.宗门建设等级 || 0))
    const other建设 = Math.max(0, Number(other.宗门建设等级 || 0))
    attackPower += ass建设 * 100 + Math.trunc(ass阵血 / 2)
    defendPower += other建设 * 100 + other阵血

    if (attackPower > defendPower) {
      // 抢夺成功
      const oldSite = ass.宗门驻地
      other.宗门驻地 = oldSite
      ass.宗门驻地 = dongTan.name
      ass.宗门建设等级 = other建设
      other.宗门建设等级 = Math.max(0, other建设 - 10)
      other.大阵血量 = 0
      await Association.setAssociation(ass.宗门名称, ass)
      await Association.setAssociation(other.宗门名称, other)
      Send(
        Text(
          `洞天被占据！${ass.宗门名称} 发动进攻 (战力${attackPower}) 攻破 ${other.宗门名称} (防御${defendPower})，夺取了 ${dongTan.name}`
        )
      )
    } else {
      await Association.setAssociation(other.宗门名称, other)
      Send(
        Text(
          `${ass.宗门名称} 进攻 ${other.宗门名称} 失败 (进攻${attackPower} / 防御${defendPower})`
        )
      )
    }
    return false
  }

  // 无主洞天 -> 直接入驻
  ass.宗门驻地 = dongTan.name
  ass.宗门建设等级 = 0
  await Association.setAssociation(ass.宗门名称, ass)
  Send(Text(`入驻成功，${ass.宗门名称} 当前驻地为：${dongTan.name}`))
  return false
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
