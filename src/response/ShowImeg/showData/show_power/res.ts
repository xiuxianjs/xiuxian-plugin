import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_power_img } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)我的炼体$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_power_img(e)
  if (img) Send(Image(img))
})
