import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { isNotNull, player_efficiency } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)逐出.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    return false
  }

  let menpai = e.MessageText.replace('#', '')

  menpai = menpai.replace('逐出', '')

  let member_qq = menpai

  if (usr_qq == member_qq) {
    Send(Text('???'))
    return false
  }

  let ifexistplayB = data.existData('player', member_qq)
  if (!ifexistplayB) {
    Send(Text('此人未踏入仙途！'))
    return false
  }
  let playerB = await data.getData('player', member_qq)
  if (!isNotNull(playerB.宗门)) {
    Send(Text('对方尚未加入宗门'))
    return false
  }
  let ass = data.getAssociation(player.宗门.宗门名称)
  let bss = data.getAssociation(playerB.宗门.宗门名称)
  if (ass.宗门名称 != bss.宗门名称) return false
  if (player.宗门.职位 == '宗主') {
    if (usr_qq == member_qq) {
      Send(Text('？？？')) //踢自己？
      return false
    }
    bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
      item => item != member_qq
    )
    bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq)
    data.setAssociation(bss.宗门名称, bss)
    delete playerB.宗门
    data.setData('player', member_qq, playerB)
    player_efficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  if (player.宗门.职位 == '副宗主') {
    if (playerB.宗门.职位 == '宗主') {
      Send(Text('你没权限'))
      return false
    }
    if (playerB.宗门.职位 == '长老' || playerB.宗门.职位 == '副宗主') {
      Send(Text(`宗门${playerB.宗门.职位}任免请上报宗主！`))
      return false
    }
    bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
      item => item != member_qq
    )
    bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq)
    data.setAssociation(bss.宗门名称, bss)
    delete playerB.宗门
    data.setData('player', member_qq, playerB)
    player_efficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  if (player.宗门.职位 == '长老') {
    if (playerB.宗门.职位 == '宗主' || playerB.宗门.职位 == '副宗主') {
      Send(Text('造反啦？'))
      return false
    }
    if (playerB.宗门.职位 == '长老') {
      Send(Text(`宗门${playerB.宗门.职位}任免请上报宗主！`))
      return false
    }
    bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
      item => item != member_qq
    )
    bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq)
    await data.setAssociation(bss.宗门名称, bss)
    await delete playerB.宗门
    await data.setData('player', member_qq, playerB)
    await player_efficiency(member_qq)
    Send(Text('已踢出！'))
    return false
  }
  playerB.favorability = 0
  await data.setData('player', member_qq, playerB)
})
