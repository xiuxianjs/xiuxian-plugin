import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  exist_najie_thing,
  Read_player,
  Write_player,
  Add_najie_thing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)供奉神石$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let x = await exist_najie_thing(usr_qq, '神石', '道具')
  if (!x) {
    Send(Text('你没有神石'))
    return false
  }
  let player = await Read_player(usr_qq)
  if (
    player.魔道值 > 0 ||
    (player.灵根.type != '转生' && player.level_id < 42)
  ) {
    Send(Text('你尝试供奉神石,但是失败了'))
    return false
  }
  player.神石 += x
  await Write_player(usr_qq, player)
  Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'))
  await Add_najie_thing(usr_qq, '神石', '道具', -x)
})
