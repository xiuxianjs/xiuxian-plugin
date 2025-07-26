import { Image, useSend } from 'alemonjs'

import { existplayer } from '@src/model'

import { selects } from '@src/response/index'
import { getNajieImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?我的纳戒$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await getNajieImage(e)
  if (img) Send(Image(img))
})
