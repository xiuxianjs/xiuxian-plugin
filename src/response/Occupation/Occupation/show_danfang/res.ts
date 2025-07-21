import { createSelects, Image, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_danfang_img } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)丹药配方$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_danfang_img(e)
  if (img) Send(Image(img))
})
