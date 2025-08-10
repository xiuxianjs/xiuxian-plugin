import {
  Image,
  PrivateEventMessageCreate,
  PublicEventMessageCreate,
  useSend
} from 'alemonjs'
import { existplayer } from '@src/model/index'
import { getPlayerImage } from '@src/model/image'

export async function Show_player(
  e: PublicEventMessageCreate | PrivateEventMessageCreate
) {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const img = await getPlayerImage(e)
  if (img) Send(Image(img))
  // e.reply(img)
  return false
}
