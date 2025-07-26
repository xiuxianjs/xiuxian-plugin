import { Text, useSend } from 'alemonjs'

import {
  readPlayer,
  readQinmidu,
  writeQinmidu,
  addNajieThing
} from '@src/model'
import { found } from '../daolv'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(我愿意|我拒绝)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.UserId != global.user_B) return false
  if (global.x == 1) {
    let player_B = await readPlayer(global.user_B)
    if (e.MessageText == '我愿意') {
      let qinmidu = await readQinmidu()
      let i = await found(global.user_A, global.user_B)
      if (i != qinmidu.length) {
        qinmidu[i].婚姻 = 1
        await writeQinmidu(qinmidu)
        Send(Text(`${player_B.名号}同意了你的请求`))
        await addNajieThing(global.user_A, '定情信物', '道具', -1)
      }
    } else if (e.MessageText == '我拒绝') {
      Send(Text(`${player_B.名号}拒绝了你的请求`))
    }
    clearTimeout(global.chaoshi_time)
    global.x = 0
    return false
  }
})
