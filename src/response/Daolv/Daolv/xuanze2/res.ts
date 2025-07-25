import { Text, useSend } from 'alemonjs'

import { readPlayer, readQinmidu, writeQinmidu } from '@src/model'
import { found } from '../daolv'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(我同意|我拒绝)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.UserId != global.user_B) return false
  if (global.x == 2) {
    let player_A = await readPlayer(global.user_A)
    let player_B = await readPlayer(global.user_B)
    let qinmidu = await readQinmidu()
    let i = await found(global.user_A, global.user_B)
    if (i != qinmidu.length) {
      if (e.MessageText == '我同意') {
        qinmidu[i].婚姻 = 0
        await writeQinmidu(qinmidu)
        Send(Text(`${player_A.名号}和${player_B.名号}和平分手`))
      } else if (e.MessageText == '我拒绝') {
        Send(Text(`${player_B.名号}拒绝了${player_A.名号}提出的建议`))
      }
    }
    clearTimeout(global.chaoshi_time)
    global.x = 0
    return false
  }
})
