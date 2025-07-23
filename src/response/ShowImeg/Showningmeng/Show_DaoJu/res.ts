import { Image, useSend } from 'alemonjs'

import { get_daoju_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)道具楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_daoju_img(e)
  if (img) Send(Image(img))
})
