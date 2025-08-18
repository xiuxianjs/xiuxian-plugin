import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/mw'
import { getDanyaoImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?丹药楼$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const img = await getDanyaoImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
