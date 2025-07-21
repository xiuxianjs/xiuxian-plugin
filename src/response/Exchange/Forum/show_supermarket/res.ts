import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { get_forum_img } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let thing_class = e.MessageText.replace('#聚宝堂', '')
  let img = await get_forum_img(e, thing_class)
  if (img) Send(Image(img))
})
