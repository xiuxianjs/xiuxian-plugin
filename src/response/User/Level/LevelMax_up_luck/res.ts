import { Text, useSend } from 'alemonjs'

import { existNajieThing } from '@src/model/index'
import { LevelMax_up } from '../level'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?幸运破体$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const x = await existNajieThing(usr_qq, '幸运草', '道具')
  if (!x) {
    Send(Text('醒醒，你没有道具【幸运草】!'))
    return false
  }
  LevelMax_up(e, true)
})
