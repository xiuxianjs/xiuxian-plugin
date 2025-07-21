import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { existplayer } from '@src/model'
import { redis } from '@src/api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)清空赏金榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let action: any = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing')
  action = await JSON.parse(action)
  action = null
  Send(Text('清除完成'))
  await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action))
})
