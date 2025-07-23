import { Image, useSend } from 'alemonjs'

import { get_tuzhi_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?装备图纸$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_tuzhi_img(e)
  if (img) Send(Image(img))
})
