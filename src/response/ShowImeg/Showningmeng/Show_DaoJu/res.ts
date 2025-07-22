import { Image, useSend } from 'alemonjs'

import { get_daoju_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)道具楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_daoju_img(e)
  if (img) Send(Image(img))
})
