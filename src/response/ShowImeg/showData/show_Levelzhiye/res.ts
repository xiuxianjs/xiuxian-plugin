import { Image, useSend } from 'alemonjs'

import { get_statezhiye_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)职业等级$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_statezhiye_img(e, null)
  if (img) Send(Image(img))
})
