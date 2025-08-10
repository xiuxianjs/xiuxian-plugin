import { Text, useMention, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer } from '@src/model/index'
import { readAction, stopAction } from '@src/response/actionHelper'
import { userKey } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?解封.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    //没有at信息直接返回,不执行
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
    if (!Mentions || Mentions.length === 0) {
      return // @ 提及为空
    }
    // 查找用户类型的 @ 提及，且不是 bot
    const User = Mentions.find(item => !item.IsBot)
    if (!User) {
      return // 未找到用户Id
    }
    //对方qq
    const qq = User.UserId
    //检查存档
    const ifexistplay = await existplayer(qq)
    if (!ifexistplay) return false
    //清除游戏状态
    await redis.del(userKey(qq, 'game_action'))
    const record = await readAction(qq)
    if (record) {
      await stopAction(qq, {
        is_jiesuan: 1,
        shutup: '1',
        working: '1',
        power_up: '1',
        Place_action: '1',
        Place_actionplus: '1'
      })
      Send(Text('已解除！'))
      return false
    }
    Send(Text('不需要解除！'))
    return false
  }
})
