import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { isNotNull, playerEfficiency } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(升级宗门|宗门升级)$/
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'))
    return false
  }
  let ass = await data.getAssociation(player.宗门.宗门名称)
  if (ass.宗门等级 == 宗门人数上限.length) {
    Send(Text('已经是最高等级宗门'))
    return false
  }
  let xian = 1
  if (ass.power == 1) {
    xian = 10
  }
  if (ass.灵石池 < ass.宗门等级 * 300000 * xian) {
    Send(
      Text(
        `本宗门目前灵石池中仅有${ass.灵石池}灵石,当前宗门升级需要${
          ass.宗门等级 * 300000 * xian
        }灵石,数量不足`
      )
    )
    return false
  }

  ass.灵石池 -= ass.宗门等级 * 300000 * xian
  ass.宗门等级 += 1
  data.setData('player', usr_qq, player)
  data.setAssociation(ass.宗门名称, ass)
  await playerEfficiency(usr_qq)
  Send(
    Text(
      '宗门升级成功' +
        `当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${
          宗门人数上限[ass.宗门等级 - 1]
        }`
    )
  )
})
