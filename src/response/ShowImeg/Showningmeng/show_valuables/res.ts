import { Image, useSend } from 'alemonjs'

import { get_valuables_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?万宝楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await get_valuables_img(e)
  if (img) Send(Image(img))
})
