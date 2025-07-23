import { Image, useSend } from 'alemonjs'

import { get_statezhiye_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?职业等级$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_statezhiye_img(e, null)
  if (img) Send(Image(img))
})
