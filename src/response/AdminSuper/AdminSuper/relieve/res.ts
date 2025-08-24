import { Text, useMention, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer } from '@src/model/index'
import { readAction, stopAction } from '@src/response/actionHelper'
import { userKey } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
export const regular = /^(#|＃|\/)?解封.*$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    const [mention] = useMention(e)
    const res = await mention.findOne()
    const target = res?.data
    if (!target || res.code !== 2000) return false
    //对方qq
    const qq = target.UserId
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

export default onResponse(selects, [mw.current, res.current])
