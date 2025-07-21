import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from 'api/api'
import { Read_player } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)拒绝双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let player = await Read_player(usr_qq)
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 1)
  Send(Text(player.名号 + '开启了拒绝模式'))
})
