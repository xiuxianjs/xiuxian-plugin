import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
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
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const player = await readPlayer(usr_qq)
  if (player.魔道值 < 1000) {
    Send(Text('你不是魔头'))
    return false
  }
  const x = await existNajieThing(usr_qq, '魔石', '道具')
  if (!x) {
    Send(Text('你没有魔石'))
    return false
  }
  if (x < 8) {
    Send(Text('魔石不足8个,当前魔石数量' + x + '个'))
    return false
  }
  await addNajieThing(usr_qq, '魔石', '道具', -8)
  const wuping_length = data.xingge[0].one.length
  const wuping_index = Math.trunc(Math.random() * wuping_length)
  const wuping = data.xingge[0].one[wuping_index]
  Send(Text('获得了' + wuping.name))
  await addNajieThing(usr_qq, wuping.name, wuping.class, 1)
})
