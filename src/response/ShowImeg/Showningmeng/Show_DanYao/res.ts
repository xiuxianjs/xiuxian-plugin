import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getDanyaoImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?丹药楼$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getDanyaoImage(e)
  if (img) Send(Image(img))
})
