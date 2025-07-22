import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { BossIsAlive } from '../../boss'

export const selects = onSelects(['message.create'])
export const regular = /^(#|\/)关闭妖王$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.IsMaster) {
    if (await BossIsAlive()) {
      await redis.del('Xiuxian:WorldBossStatus')
      await redis.del('xiuxian@1.3.0Record')
      Send(Text('妖王挑战关闭！'))
    } else Send(Text('妖王未开启'))
  }
})
