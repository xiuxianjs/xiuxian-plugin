import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { BossIsAlive } from '../../boss'

import { selects } from '@src/response/index'
import { KEY_RECORD_TWO } from '@src/model/settions'
export const regular = /^(#|＃|\/)?关闭金角大王$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.IsMaster) {
    if (await BossIsAlive()) {
      await redis.del('Xiuxian:WorldBossStatus2')
      await redis.del(KEY_RECORD_TWO)
      Send(Text('金角大王挑战关闭！'))
    } else {
      Send(Text('金角大王未开启'))
    }
  }
})
