import { Image, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
import { getGongfaImage } from '@src/model/image'
import { existplayer } from '@src/model'
export const regular = /^(#|＃|\/)?功法楼$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const img = await getGongfaImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
