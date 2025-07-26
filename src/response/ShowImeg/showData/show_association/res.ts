import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getAssociationImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?我的宗门$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getAssociationImage(e)
  if (img) Send(Image(img))
})
