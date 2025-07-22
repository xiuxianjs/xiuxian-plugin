import { Image, useSend } from 'alemonjs'

import { get_ningmenghome_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular =
  /^(#|\/)柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let thing_type = e.MessageText.replace('#柠檬堂', '')
  let img = await get_ningmenghome_img(e, thing_type)
  if (img) Send(Image(img))
})
