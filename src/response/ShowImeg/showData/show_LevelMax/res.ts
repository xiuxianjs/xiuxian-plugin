import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getStatemaxImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?炼体境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const img = await getStatemaxImage(e, null)
  if (img) Send(Image(img))
})
