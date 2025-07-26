import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getStatezhiyeImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?职业等级$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getStatezhiyeImage(e, null)
  if (img) Send(Image(img))
})
