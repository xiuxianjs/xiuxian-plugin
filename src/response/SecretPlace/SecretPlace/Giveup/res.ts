import { Text, useSend } from 'alemonjs'

import { existplayer } from '@src/model/index'
import { readAction, stopAction } from '@src/response/actionHelper'
import { userKey, getString } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?逃离/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    return false
  }
  //获取游戏状态
  const game_action = await getString(userKey(usr_qq, 'game_action'))
  //防止继续其他娱乐行为
  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  const action = await readAction(usr_qq)
  if (
    action &&
    (action.Place_action === '0' ||
      action.Place_actionplus === '0' ||
      action.mojie === '0')
  ) {
    await stopAction(usr_qq, {
      is_jiesuan: 1,
      shutup: '1',
      working: '1',
      power_up: '1',
      Place_action: '1',
      Place_actionplus: '1',
      mojie: '1'
    })
    Send(Text('你已逃离！'))
    return false
  }
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
