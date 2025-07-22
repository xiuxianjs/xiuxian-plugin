import { Image, useSend } from 'alemonjs'

import { get_equipment_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)我的装备$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_equipment_img(e)
  if (img) Send(Image(img))
})
