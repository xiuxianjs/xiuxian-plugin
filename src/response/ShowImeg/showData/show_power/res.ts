import { Image, useSend } from 'alemonjs'

import { get_power_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)我的炼体$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_power_img(e)
  if (img) Send(Image(img))
})
