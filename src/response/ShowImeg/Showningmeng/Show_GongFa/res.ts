import { Image, useSend } from 'alemonjs'

import { get_gongfa_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)功法楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_gongfa_img(e)
  if (img) Send(Image(img))
})
