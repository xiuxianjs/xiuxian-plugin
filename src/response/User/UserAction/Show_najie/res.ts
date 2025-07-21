import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { existplayer, get_najie_img } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)我的纳戒$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await get_najie_img(e)
  if (img) Send(Image(img))
})
