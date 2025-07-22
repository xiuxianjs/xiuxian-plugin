import { Text, useSend } from 'alemonjs'

import { exist_najie_thing } from '@src/model'
import { LevelMax_up } from '../level'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)幸运破体$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let x = await exist_najie_thing(usr_qq, '幸运草', '道具')
  if (!x) {
    Send(Text('醒醒，你没有道具【幸运草】!'))
    return false
  }
  LevelMax_up(e, true)
})
