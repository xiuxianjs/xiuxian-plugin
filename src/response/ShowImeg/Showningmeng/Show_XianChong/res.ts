import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getXianChongImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?仙宠楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getXianChongImage(e)
  if (img) Send(Image(img))
})
