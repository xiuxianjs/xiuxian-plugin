import { Text, useSend } from 'alemonjs'

import { existNajieThing, existplayer } from '@src/model/index'
import { LevelMax_up } from '../level'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?幸运破体$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId

  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false

  const x = await existNajieThing(usr_qq, '幸运草', '道具')
  if (!x) {
    Send(Text('醒醒，你没有道具【幸运草】!'))
    return false
  }
  LevelMax_up(e, true)
})
