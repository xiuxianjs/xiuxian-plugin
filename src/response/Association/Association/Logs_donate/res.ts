import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from '@src/api/api'
import { isNotNull, sortBy } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)宗门捐献记录$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) return false
  let ass = data.getAssociation(player.宗门.宗门名称)
  let donate_list = []
  for (let i in ass.所有成员) {
    //遍历所有成员
    let member_qq = ass.所有成员[i]
    let member_data = data.getData('player', member_qq)
    if (!isNotNull(member_data.宗门.lingshi_donate)) {
      member_data.宗门.lingshi_donate = 0 //未定义捐赠数量则为0
    }
    donate_list[i] = {
      name: member_data.名号,
      lingshi_donate: member_data.宗门.lingshi_donate
    }
  }
  donate_list.sort(sortBy('lingshi_donate'))
  let msg = [`${ass.宗门名称} 灵石捐献记录表`]
  for (let i = 0; i < donate_list.length; i++) {
    msg.push(
      `第${i + 1}名  ${donate_list[i].name}  捐赠灵石:${
        donate_list[i].lingshi_donate
      }`
    )
  }
  await Send(Text(msg.join('')))
})
