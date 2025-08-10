import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { notUndAndNull, convert2integer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?维护护宗大阵.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (!notUndAndNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (
    player.宗门.职位 == '宗主' ||
    player.宗门.职位 == '副宗主' ||
    player.宗门.职位 == '长老'
  ) {
  } else {
    Send(Text('只有宗主、副宗主或长老可以操作'))
    return false
  }
  //获取灵石数量
  const msg = e.MessageText.replace(/^#维护护宗大阵/, '')
  //校验输入灵石数
  const lingshi = await convert2integer(msg)
  const ass = await data.getAssociation(player.宗门.宗门名称)
  if (ass.灵石池 < lingshi) {
    Send(Text(`宗门灵石池只有${ass.灵石池}灵石,数量不足`))
    return false
  }
  let xian = 5
  if (ass.power == 1) {
    xian = 2
  }
  ass.大阵血量 += lingshi * xian
  ass.灵石池 -= lingshi
  await data.setAssociation(ass.宗门名称, ass)
  Send(
    Text(
      `维护成功,宗门还有${ass.灵石池}灵石,护宗大阵增加了${lingshi * xian}血量`
    )
  )
})
