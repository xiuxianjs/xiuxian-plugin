import { Image, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_gongfa_img } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)功法楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_gongfa_img(e)
  if (img) Send(Image(img))
})
