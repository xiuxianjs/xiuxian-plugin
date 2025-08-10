import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?查看护宗大阵$/

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
  const ass = await data.getAssociation(player.宗门.宗门名称)
  Send(Text(`护宗大阵血量:${ass.大阵血量}`))
})
