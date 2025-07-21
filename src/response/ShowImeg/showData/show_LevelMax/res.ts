import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_statemax_img } from 'model/xiuxian'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)炼体境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_statemax_img(e, null)
  if (img) Send(Image(img))
})
