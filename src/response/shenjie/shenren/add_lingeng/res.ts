import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  existNajieThing,
  readPlayer,
  writePlayer,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?供奉神石$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const x = await existNajieThing(usr_qq, '神石', '道具')
  if (!x) {
    Send(Text('你没有神石'))
    return false
  }
  const player = await readPlayer(usr_qq)
  if (
    player.魔道值 > 0 ||
    (player.灵根.type != '转生' && player.level_id < 42)
  ) {
    Send(Text('你尝试供奉神石,但是失败了'))
    return false
  }
  player.神石 += x
  await writePlayer(usr_qq, player)
  Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'))
  await addNajieThing(usr_qq, '神石', '道具', -x)
})
