import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getGongfaImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?功法楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getGongfaImage(e)
  if (img) Send(Image(img))
})
