import { Text, useSend } from 'alemonjs'

import { existplayer, readPlayer } from '@src/model/index'
import { Level_up } from '../Level/level'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?自动突破$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const player = await readPlayer(usr_qq)
  if (player.level_id > 31 || player.lunhui == 0) return false
  Send(Text('已为你开启10次自动突破'))
  let num = 1
  const timer = setInterval(() => {
    Level_up(e)
    num++
    if (num > 10) clearInterval(timer)
  }, 185000)
  return false
})
