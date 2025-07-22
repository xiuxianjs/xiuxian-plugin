import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { BossIsAlive } from '../../boss'

export const selects = onSelects(['message.create', 'private.message.create'])
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
