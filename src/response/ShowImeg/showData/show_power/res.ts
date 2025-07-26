import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getPowerImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?我的炼体$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getPowerImage(e)
  if (img) Send(Image(img))
})
