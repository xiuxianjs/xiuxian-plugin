import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { exist_najie_thing } from '@src/model'
import { Level_up } from '../level'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)幸运突破$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let x = await exist_najie_thing(usr_qq, '幸运草', '道具')
  if (!x) {
    Send(Text('醒醒，你没有道具【幸运草】!'))
    return false
  }
  Level_up(e, true)
})
