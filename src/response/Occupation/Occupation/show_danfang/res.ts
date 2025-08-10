import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getdanfangImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?丹药配方$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const img = await getdanfangImage(e)
  if (img) Send(Image(img))
})
