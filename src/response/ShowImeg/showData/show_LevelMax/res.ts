import { Image, useSend } from 'alemonjs'

import { get_statemax_img } from '@src/model/xiuxian'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)炼体境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_statemax_img(e, null)
  if (img) Send(Image(img))
})
