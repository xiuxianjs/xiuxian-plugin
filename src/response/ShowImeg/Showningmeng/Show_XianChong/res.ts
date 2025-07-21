import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_XianChong_img } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)仙宠楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_XianChong_img(e)
  if (img) Send(Image(img))
})
