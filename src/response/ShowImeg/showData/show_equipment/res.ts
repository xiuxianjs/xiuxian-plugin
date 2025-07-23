import { Image, useSend } from 'alemonjs'

import { get_equipment_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?我的装备$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_equipment_img(e)
  if (img) Send(Image(img))
})
