import { Text, useSend } from 'alemonjs'

import { existNajieThing } from '@src/model'
import { Level_up } from '../level'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?幸运突破$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let x = await existNajieThing(usr_qq, '幸运草', '道具')
  if (!x) {
    Send(Text('醒醒，你没有道具【幸运草】!'))
    return false
  }
  Level_up(e, true)
})
