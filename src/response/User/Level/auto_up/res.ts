import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { existplayer, Read_player } from 'model'
import { Level_up } from '../level'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)自动突破$/

export default onResponse(selects, async e => {
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
