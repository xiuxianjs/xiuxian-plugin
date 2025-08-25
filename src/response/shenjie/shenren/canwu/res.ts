import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  readPlayer,
  existNajieThing,
  addNajieThing
} from '@src/model/index'
import { getDataList } from '@src/model/DataList'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?参悟神石$/

const res = onResponse(selects, async e => {
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
  const timeDanyaoData = await getDataList('TimeDanyao')
  const wuping_length = timeDanyaoData.length
  const wuping_index = Math.floor(Math.random() * wuping_length)
  const wuping = timeDanyaoData[wuping_index]
  Send(Text('获得了' + wuping.name))
  await addNajieThing(usr_qq, wuping.name, wuping.class, 1)
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
