import {
  Image,
  PrivateEventMessageCreate,
  PublicEventMessageCreate,
  useSend
} from 'alemonjs'
import { existplayer } from '@src/model'
import { getPlayerImage } from '@src/model/image'

export async function Show_player(
  e: PublicEventMessageCreate | PrivateEventMessageCreate
) {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await getPlayerImage(e)
  if (img) Send(Image(img))
  // e.reply(img)
  return false
}
