import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { isNotNull } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)查看护宗大阵$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  let ass = data.getAssociation(player.宗门.宗门名称)
  Send(Text(`护宗大阵血量:${ass.大阵血量}`))
})
