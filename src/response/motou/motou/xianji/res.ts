import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  existNajieThing,
  addNajieThing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?献祭魔石$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await readPlayer(usr_qq)
  if (player.魔道值 < 1000) {
    Send(Text('你不是魔头'))
    return false
  }
  let x = await existNajieThing(usr_qq, '魔石', '道具')
  if (!x) {
    Send(Text('你没有魔石'))
    return false
  }
  if (x < 8) {
    Send(Text('魔石不足8个,当前魔石数量' + x + '个'))
    return false
  }
  await addNajieThing(usr_qq, '魔石', '道具', -8)
  let wuping_length
  let wuping_index
  let wuping
  wuping_length = data.xingge[0].one.length
  wuping_index = Math.trunc(Math.random() * wuping_length)
  wuping = data.xingge[0].one[wuping_index]
  Send(Text('获得了' + wuping.name))
  await addNajieThing(usr_qq, wuping.name, wuping.class, 1)
})
