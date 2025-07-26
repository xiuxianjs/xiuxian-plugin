import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getQquipmentImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?我的装备$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getQquipmentImage(e)
  if (img) Send(Image(img))
})
