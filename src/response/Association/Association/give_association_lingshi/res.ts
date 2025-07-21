import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { isNotNull, setFileValue } from 'model'
import { data } from 'api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)宗门(上交|上缴|捐赠)灵石[1-9]d*/
const 宗门灵石池上限 = [
  2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000
]

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    return false
  }
  //获取灵石数量
  let reg = new RegExp(/#宗门(上交|上缴|捐赠)灵石/)
  let msg = e.MessageText.replace(reg, '').trim()
  if (msg == '' || msg == undefined) {
    Send(Text('请输入灵石数量'))
    return false
  }
  let lingshi: any = parseInt(msg)
  if (isNaN(lingshi) || isFinite(lingshi)) {
    Send(Text('请输入正确的灵石数量'))
    return false
  }
  if (lingshi <= 0) {
    Send(Text('请输入正确的灵石数量'))
    return false
  }
  if (player.灵石 < lingshi) {
    Send(Text(`你身上只有${player.灵石}灵石,数量不足`))
    return false
  }
  let ass = data.getAssociation(player.宗门.宗门名称)
  let xf = 1
  if (ass.power == 1) {
    xf = 10
  }
  if (ass.灵石池 + lingshi > 宗门灵石池上限[ass.宗门等级 - 1] * xf) {
    Send(
      Text(
        `${ass.宗门名称}的灵石池最多还能容纳${
          宗门灵石池上限[ass.宗门等级 - 1] * xf - ass.灵石池
        }灵石,请重新捐赠`
      )
    )
    return false
  }
  ass.灵石池 += lingshi
  if (!isNotNull(player.宗门.lingshi_donate)) {
    player.宗门.lingshi_donate = 0 //未定义捐赠数量则为0
  }
  player.宗门.lingshi_donate += lingshi
  data.setData('player', usr_qq, player)
  data.setAssociation(ass.宗门名称, ass)
  await setFileValue(usr_qq, -lingshi, '灵石')
  Send(
    Text(
      `捐赠成功,你身上还有${player.灵石 - lingshi}灵石,宗门灵石池目前有${
        ass.灵石池
      }灵石`
    )
  )
})
