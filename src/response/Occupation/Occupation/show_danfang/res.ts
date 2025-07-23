import { Image, useSend } from 'alemonjs'

import { get_danfang_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?丹药配方$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_danfang_img(e)
  if (img) Send(Image(img))
})
