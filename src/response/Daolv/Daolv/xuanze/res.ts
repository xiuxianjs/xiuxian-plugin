import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import {
  Read_player,
  Read_qinmidu,
  Write_qinmidu,
  Add_najie_thing
} from '@src/model'
import { found } from '../daolv'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)^(我愿意|我拒绝)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.UserId != global.user_B) return false
  if (global.x == 1) {
    let player_B = await Read_player(global.user_B)
    if (e.MessageText == '我愿意') {
      let qinmidu = await Read_qinmidu()
      let i = await found(global.user_A, global.user_B)
      if (i != qinmidu.length) {
        qinmidu[i].婚姻 = 1
        await Write_qinmidu(qinmidu)
        Send(Text(`${player_B.名号}同意了你的请求`))
        await Add_najie_thing(global.user_A, '定情信物', '道具', -1)
      }
    } else if (e.MessageText == '我拒绝') {
      Send(Text(`${player_B.名号}拒绝了你的请求`))
    }
    clearTimeout(global.chaoshi_time)
    global.x = 0
    return false
  }
})
