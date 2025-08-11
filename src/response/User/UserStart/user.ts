import {
  Image,
  PrivateEventMessageCreate,
  EventsMessageCreateEnum,
  useSend,
  Text
} from 'alemonjs'
import { existplayer } from '@src/model/index'
import { getPlayerImage } from '@src/model/image'

// 公域事件守卫
function isPublic(e: unknown): e is EventsMessageCreateEnum {
  return (
    !!e && typeof e === 'object' && 'Guild' in (e as Record<string, unknown>)
  )
}

export async function Show_player(
  e: EventsMessageCreateEnum | PrivateEventMessageCreate
) {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  // 仅在公域上下文生成图片
  if (isPublic(e)) {
    try {
      const img = await getPlayerImage(
        e as Parameters<typeof getPlayerImage>[0]
      )
      if (img) {
        if (Buffer.isBuffer(img)) Send(Image(img))
        else if (typeof img === 'string') {
          try {
            Send(Image(Buffer.from(img)))
          } catch {
            /* ignore */
          }
        }
        return false
      }
    } catch {
      Send(Text('角色卡生成失败'))
      return false
    }
  } else {
    Send(Text('私聊暂不支持角色卡展示'))
  }
  return false
}
