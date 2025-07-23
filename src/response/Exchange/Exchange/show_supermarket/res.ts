import { Image, useSend } from 'alemonjs'

import { get_supermarket_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?冲水堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let thing_class = e.MessageText.replace(/^(#|＃|\/)?冲水堂/, '')
  let img = await get_supermarket_img(e, thing_class)
  if (img) Send(Image(img))
})
