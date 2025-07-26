import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { isNotNull } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?查看护宗大阵$/

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
  let ass = await data.getAssociation(player.宗门.宗门名称)
  Send(Text(`护宗大阵血量:${ass.大阵血量}`))
})
