import { Image, useSend } from 'alemonjs'

import { get_state_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)练气境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_state_img(e, null)
  if (img) Send(Image(img))
})
