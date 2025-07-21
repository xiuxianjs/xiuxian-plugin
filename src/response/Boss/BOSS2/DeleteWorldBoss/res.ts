import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from 'api/api'
import { BossIsAlive } from '../../boss'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)关闭金角大王$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.IsMaster) {
    if (await BossIsAlive()) {
      await redis.del('Xiuxian:WorldBossStatus2')
      await redis.del('xiuxian@1.3.0Record2')
      Send(Text('金角大王挑战关闭！'))
    } else Send(Text('金角大王未开启'))
  }
})
