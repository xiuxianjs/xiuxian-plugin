import { Text, useSend } from 'alemonjs'

import { readPlayer, readQinmidu, writeQinmidu } from '@src/model'
import { Daolv, found } from '../daolv'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(我同意|我拒绝)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.UserId != Daolv.user_B) return false
  if (Daolv.x == 2) {
    let player_A = await readPlayer(Daolv.user_A)
    let player_B = await readPlayer(Daolv.user_B)
    let qinmidu = await readQinmidu()
    let i = await found(Daolv.user_A, Daolv.user_B)
    if (i != qinmidu.length) {
      if (e.MessageText == '我同意') {
        qinmidu[i].婚姻 = 0
        await writeQinmidu(qinmidu)
        Send(Text(`${player_A.名号}和${player_B.名号}和平分手`))
      } else if (e.MessageText == '我拒绝') {
        Send(Text(`${player_B.名号}拒绝了${player_A.名号}提出的建议`))
      }
    }
    clearTimeout(Daolv.chaoshi_time)
    Daolv.set_chaoshi_time(null)
    Daolv.set_x(0)
    return false
  }
})
