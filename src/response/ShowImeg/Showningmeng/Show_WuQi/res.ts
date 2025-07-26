import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getWuqiImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?装备楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getWuqiImage(e)
  if (img) Send(Image(img))
})
