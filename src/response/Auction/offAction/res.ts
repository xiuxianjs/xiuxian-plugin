import { Text, useSend } from 'alemonjs'
import { redis } from '@src/model/api'

import { selects } from '@src/response/index'
import {
  KEY_AUCTION_GROUP_LIST,
  KEY_AUCTION_OFFICIAL_TASK
} from '@src/model/constants'
export const regular = /^(#|＃|\/)?关闭星阁体系$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以关闭'))
    return false
  }

  const redisGlKey = KEY_AUCTION_GROUP_LIST
  await redis.del(KEY_AUCTION_OFFICIAL_TASK)
  await redis.del(redisGlKey)

  Send(Text('星阁体系已关闭！'))
  return false
})
