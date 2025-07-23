import { Image, useSend } from 'alemonjs'

import { get_adminset_img } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?修仙设置$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false

  let img = await get_adminset_img(e)
  if (img) Send(Image(img))
})
