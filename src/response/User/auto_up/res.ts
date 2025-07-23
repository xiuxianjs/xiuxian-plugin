import { Text, useSend } from 'alemonjs'

import { existplayer, Read_player } from '@src/model'
import { Level_up } from '../Level/level'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?自动突破$/

export default onResponse(selects, async (e: any) => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await Read_player(usr_qq)
  if (player.level_id > 31 || player.lunhui == 0) return false
  Send(Text('已为你开启10次自动突破'))
  let num = 1
  let time: any = setInterval(() => {
    Level_up(e)
    num++
    if (num > 10) clearInterval(time)
  }, 185000)
  return false
})
