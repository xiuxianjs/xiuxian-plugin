import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer, notUndAndNull, readPlayer } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?星阁拍卖行$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId

  //固定写法
  //判断是否为匿名创建存档
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const res = await redis.get('xiuxian:AuctionofficialTask')
  if (!notUndAndNull(res)) {
    Send(Text('目前没有拍卖正在进行'))
    return false
  }
  const auction = JSON.parse(res)

  let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`
  if (auction.last_offer_player === 0) {
    msg += '暂无人出价'
  } else {
    const player = await readPlayer(auction.last_offer_player)
    msg += `最高出价是${player.名号}叫出的${auction.last_price}`
  }
  await Send(Text(msg))
})
