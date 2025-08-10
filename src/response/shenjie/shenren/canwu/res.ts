import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  existNajieThing,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?参悟神石$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const player = await readPlayer(usr_qq)
  if (
    player.魔道值 > 0 ||
    (player.灵根.type != '转生' && player.level_id < 42)
  ) {
    Send(Text('你尝试领悟神石,但是失败了'))
    return false
  }
  const x = await existNajieThing(usr_qq, '神石', '道具')
  if (!x) {
    Send(Text('你没有神石'))
    return false
  }
  if (x < 8) {
    Send(Text('神石不足8个,当前神石数量' + x + '个'))
    return false
  }
  await addNajieThing(usr_qq, '神石', '道具', -8)
  const wuping_length = data.timedanyao_list.length
  const wuping_index = Math.trunc(Math.random() * wuping_length)
  const wuping = data.timedanyao_list[wuping_index]
  Send(Text('获得了' + wuping.name))
  await addNajieThing(usr_qq, wuping.name, wuping.class, 1)
})
