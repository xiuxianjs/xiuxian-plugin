import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull, convert2integer } from '@src/model/index'

import type { AssociationDetailData } from '@src/types/domain'
import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?维护护宗大阵.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = await data.getData('player', usr_qq)
  if (!notUndAndNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
    Send(Text('只有宗主、副宗主或长老可以操作'))
    return false
  }
  //获取灵石数量
  const msg = e.MessageText.replace(/^#维护护宗大阵/, '')
  //校验输入灵石数
  const lingshi = await convert2integer(msg)
  const ass = await data.getAssociation(player.宗门.宗门名称)
  if (ass === 'error') {
    Send(Text('宗门数据异常'))
    return false
  }
  // 断言类型收窄
  const association = ass as AssociationDetailData
  if ((association.灵石池 as number) < lingshi) {
    Send(Text(`宗门灵石池只有${ass.灵石池}灵石,数量不足`))
    return false
  }
  let xian = 5
  if (association.power == 1) {
    xian = 2
  }
  association.大阵血量 = (association.大阵血量 || 0) + lingshi * xian
  association.灵石池 = (association.灵石池 || 0) - lingshi
  await data.setAssociation(association.宗门名称, association)
  Send(
    Text(
      `维护成功,宗门还有${ass.灵石池}灵石,护宗大阵增加了${lingshi * xian}血量`
    )
  )
})
