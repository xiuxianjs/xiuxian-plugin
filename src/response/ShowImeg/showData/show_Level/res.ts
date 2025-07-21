import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_state_img } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)练气境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_state_img(e, null)
  if (img) Send(Image(img))
})
