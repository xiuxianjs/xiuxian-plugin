import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getTuzhiImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?装备图纸$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getTuzhiImage(e)
  if (img) Send(Image(img))
})
