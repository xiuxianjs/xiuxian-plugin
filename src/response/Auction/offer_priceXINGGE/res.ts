import { Text, useSend } from 'alemonjs'

import { redis, config } from '@src/api/api'
import { existplayer, isNotNull, Read_player } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?星阁出价.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId

  //固定写法
  //判断是否为匿名创建存档
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  // 此群是否开启星阁体系
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  if (!(await redis.sismember(redisGlKey, String(e.ChannelId)))) return false
  // 是否到拍卖时间
  let auction = await redis.get('xiuxian:AuctionofficialTask')
  if (!isNotNull(auction)) {
    const { openHour, closeHour } = config.getConfig(
      'xiuxian',
      'xiuxian'
    ).Auction
    Send(Text(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`))
    return false
  }

  let player = await Read_player(usr_qq)
  const auctionData = JSON.parse(auction)
  // let start_price = auction.start_price;
  let last_price = auctionData.last_price
  let reg = e.MessageText.replace('(#|＃|/)?星阁出价', '')
  if (auctionData.last_offer_player == usr_qq) {
    Send(Text('不能自己给自己抬价哦!'))
    return false
  }
  let new_price = Number(reg)
  if (!new_price) {
    new_price = Math.floor(Math.ceil(last_price * 1.1))
  } else {
    if (new_price < Math.ceil(last_price * 1.1)) {
      Send(Text(`最新价格为${last_price}，每次加价不少于10 %！`))
      return false
    }
  }
  if (player.灵石 < new_price) {
    Send(Text('没这么多钱也想浑水摸鱼?'))
    return false
  }

  // if (auction.group_id.indexOf(e.group_id) < 0) {
  //   auction.group_id += '|' + e.group_id;
  // } NOTE: 过时的
  // 关掉了
  // await redis.sAdd(redisGlKey, String(e.group_id));
  auctionData.groupList = await redis.smembers(redisGlKey)

  const msg = `${player.名号}叫价${new_price} `

  Send(Text(msg))
  // ↑新的：RetuEase

  auctionData.last_price = new_price
  auctionData.last_offer_player = usr_qq
  auctionData.last_offer_price = new Date().getTime() // NOTE: Big SB
  await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(auction))
})
