import { Text, useSend } from 'alemonjs'

import { pushInfo, redis } from '@src/api/api'
import {
  existplayer,
  Read_player,
  convert2integer,
  Write_player
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?悬赏.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await Read_player(usr_qq)
  let qq = e.MessageText.replace(/^(#|＃|\/)?悬赏/, '')
  let code = qq.split('*')
  qq = code[0]
  let money = await convert2integer(code[1])
  if (money < 300000) {
    money = 300000
  }
  if (player.灵石 < money) {
    Send(Text('您手头这点灵石,似乎在说笑'))
    return false
  }
  let player_B
  try {
    player_B = await Read_player(qq)
  } catch {
    Send(Text('世间没有这人')) //查无此人
    return false
  }
  let arr = { 名号: player_B.名号, QQ: qq, 赏金: money }
  let action: any = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing')
  action = await JSON.parse(action)
  if (action != null) {
    action.push(arr)
  } else {
    action = []
    action.push(arr)
  }
  player.灵石 -= money
  await Write_player(usr_qq, player)
  Send(Text('悬赏成功!'))
  // todo 全服公告
  let msg = ''
  msg += '【全服公告】' + player_B.名号 + '被悬赏了' + money + '灵石'
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const groupList = await redis.smembers(redisGlKey)
  for (const group of groupList) {
    const [platform, group_id] = group.split(':')
    pushInfo(platform, group_id, true, msg)
  }
  await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action))
})
