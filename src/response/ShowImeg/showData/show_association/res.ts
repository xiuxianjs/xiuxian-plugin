import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getAssociationImage } from '@src/model/image'
import { existplayer } from '@src/model'
export const regular = /^(#|＃|\/)?我的宗门$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const img = await getAssociationImage(e)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
