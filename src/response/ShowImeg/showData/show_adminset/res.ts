import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getAdminsetImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?修仙设置$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  // if (!e.IsMaster) return false
  const img = await getAdminsetImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
