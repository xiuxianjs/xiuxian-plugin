import { Text, useSend } from 'alemonjs'

import { config, redis } from '@src/api/api'
import { openAU, Read_player } from '@src/model'

export const selects = onSelects(['message.create'])
export const regular = /^(#|\/)开启星阁体系$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有只因器人主人可以开启'))
    return false
  }

  // 如果星阁已经开了，将本群加入Redis
  // INFO: 缺省判断是否在进行，GroupList判断哪些群开启了星阁体系
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const groupList = await redis.smembers(redisGlKey)
  if (groupList.length > 0) {
    if (await redis.sismember(redisGlKey, String(e.ChannelId))) {
      console.log(await redis.smembers(redisGlKey))
      Send(Text('星阁拍卖行已经开啦'))
      return false
    }
    await redis.sadd(redisGlKey, String(e.ChannelId))
    Send(Text('星阁已开启，已将本群添加至星阁体系'))
    return false
  }

  // 如果没开，判断是否在开启时间
  const nowDate = new Date()
  const todayDate = new Date(nowDate)
  const { openHour, closeHour } = config.getConfig('xiuxian', 'xiuxian')
  const todayTime = todayDate.setHours(0, 0, 0, 0)
  const openTime = todayTime + openHour * 60 * 60 * 1000
  const nowTime = nowDate.getTime()
  const closeTime = todayTime + closeHour * 60 * 60 * 1000
  if (nowTime > openTime && nowTime < closeTime) {
    // 如果在拍卖时间，随机一个物品来开启
    const auction = await openAU()
    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`
    if (auction.last_offer_player === 0) {
      msg += '暂无人出价'
    } else {
      const player = await Read_player(auction.last_offer_player)
      msg += `最高出价是${player.名号}叫出的${auction.last_price}`
    }
    await Send(Text(msg))
  }

  // const addTIME = intervalTime;
  // await redis.set(
  //   'xiuxian:AuctionofficialTaskENDTIME',
  //   JSON.stringify(Date.now() + addTIME)
  // );

  // await redis.set('xiuxian:AuctionofficialTask_E', e.ChannelId); NOTE: 过时的
  try {
    await redis.del(redisGlKey)
  } catch (err) {
    console.log(err)
  }
  await redis.sadd(redisGlKey, String(e.ChannelId))
  Send(Text('星阁体系在本群开启！'))
})
