import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_daoju_img } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)道具楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_daoju_img(e)
  if (img) Send(Image(img))
})
