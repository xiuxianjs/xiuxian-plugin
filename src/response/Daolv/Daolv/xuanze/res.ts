import { Text, useSend } from 'alemonjs'

import {
  readPlayer,
  readQinmidu,
  writeQinmidu,
  addNajieThing
} from '@src/model'
import { Daolv, found } from '../daolv'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(我愿意|我拒绝)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (e.UserId != Daolv.user_B) return false
  if (Daolv.x == 1) {
    const player_B = await readPlayer(Daolv.user_B)
    if (e.MessageText == '我愿意') {
      const qinmidu = await readQinmidu()
      const i = await found(Daolv.user_A, Daolv.user_B)
      if (i != qinmidu.length) {
        qinmidu[i].婚姻 = 1
        await writeQinmidu(qinmidu)
        Send(Text(`${player_B.名号}同意了你的请求`))
        await addNajieThing(Daolv.user_A, '定情信物', '道具', -1)
      }
    } else if (e.MessageText == '我拒绝') {
      Send(Text(`${player_B.名号}拒绝了你的请求`))
    }
    clearTimeout(Daolv.chaoshi_time)
    Daolv.set_chaoshi_time(null)
    Daolv.set_x(0)
    return false
  }
})
