import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/mw'
import { getAdminsetImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?修仙设置$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  const img = await getAdminsetImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
