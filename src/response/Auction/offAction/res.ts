import { Text, useSend, createSelects } from 'alemonjs'
import { redis } from '@src/api/api'
import { createEventName } from '@src/response/util'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)关闭星阁体系$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有只因器人主人可以关闭'))
    return false
  }

  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  await redis.del('xiuxian:AuctionofficialTask')
  await redis.del(redisGlKey)
  // await redis.set(
  //   'xiuxian:AuctionofficialTaskENDTIME',
  //   JSON.stringify(1145141919181145)
  // );
  Send(Text('星阁体系已关闭！'))
  return false
})
