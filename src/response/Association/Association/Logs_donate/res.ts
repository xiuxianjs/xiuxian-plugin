import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { sortBy } from '@src/model/cultivation'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门捐献记录$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = await data.getData('player', usr_qq)
  if (!notUndAndNull(player.宗门)) return false
  const ass = await data.getAssociation(player.宗门.宗门名称)
  const donate_list = []
  for (const i in ass.所有成员) {
    //遍历所有成员
    const member_qq = ass.所有成员[i]
    const member_data = await data.getData('player', member_qq)
    if (!notUndAndNull(member_data.宗门.lingshi_donate)) {
      member_data.宗门.lingshi_donate = 0 //未定义捐赠数量则为0
    }
    donate_list[i] = {
      name: member_data.名号,
      lingshi_donate: member_data.宗门.lingshi_donate
    }
  }
  donate_list.sort(sortBy('lingshi_donate'))
  const msg = [`${ass.宗门名称} 灵石捐献记录表`]
  for (let i = 0; i < donate_list.length; i++) {
    msg.push(
      `第${i + 1}名  ${donate_list[i].name}  捐赠灵石:${
        donate_list[i].lingshi_donate
      }`
    )
  }
  await Send(Text(msg.join('')))
})
