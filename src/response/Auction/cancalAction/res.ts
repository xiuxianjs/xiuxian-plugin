import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { KEY_AUCTION_GROUP_LIST } from '@src/model/constants'
import mw from '@src/response/mw'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?取消星阁体系$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以取消'))
    return false
  }

  const redisGlKey = KEY_AUCTION_GROUP_LIST
  if (!redis.sismember(redisGlKey, String(e.ChannelId))) {
    Send(Text('本来就没开取消个冒险'))
    return false
  }
  await redis.srem(redisGlKey, String(e.ChannelId))
  Send(Text('星阁体系在本群取消了'))
})

export default onResponse(selects, [mw.current, res.current])
