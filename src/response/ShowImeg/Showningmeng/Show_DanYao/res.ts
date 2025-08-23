import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/mw'
import { getDanyaoImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?丹药楼$/
const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const img = await getDanyaoImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
