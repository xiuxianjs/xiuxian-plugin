import {
  Image,
  PrivateEventMessageCreate,
  PublicEventMessageCreate,
  useSend
} from 'alemonjs'
import { existplayer, get_player_img } from '@src/model'

export async function Show_player(
  e: PublicEventMessageCreate | PrivateEventMessageCreate
) {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await get_player_img(e)
  if (img) Send(Image(img))
  // e.reply(img)
  return false
}
