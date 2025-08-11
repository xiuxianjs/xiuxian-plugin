import { Text, Image, useSend } from 'alemonjs'
import type { EventsMessageCreateEnum } from 'alemonjs'

import { existplayer } from '@src/model/index'
import { selects } from '@src/response/index'
import { getPlayerImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?我(的练气)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  // 仅在公共消息上下文生成图片
  if (!(e as EventsMessageCreateEnum).Guild) {
    Send(Text('请在群聊/频道中使用该指令'))
    return false
  }
  const img = await getPlayerImage(e as EventsMessageCreateEnum)
  if (!img) {
    Send(Text('生成人物卡图片失败'))
    return false
  }
  if (typeof img === 'string') {
    Send(Image(Buffer.from(img)))
  } else {
    Send(Image(img))
  }
  return false
})
