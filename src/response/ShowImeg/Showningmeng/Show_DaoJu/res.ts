import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getDaojuImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?道具楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getDaojuImage(e)
  if (img) Send(Image(img))
})
