import { Text, Image, useSend } from 'alemonjs'
import type { EventsMessageCreateEnum } from 'alemonjs'

import { existplayer } from '@src/model/index'
import { selects } from '@src/response/mw'
import { getPlayerImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?我(的练气)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  const img = await getPlayerImage(e as EventsMessageCreateEnum)
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
    return false
  }
  Send(Text('图片加载失败'))
  return false
})
