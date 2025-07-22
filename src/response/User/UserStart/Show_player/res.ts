import { Image, useSend } from 'alemonjs'

import { existplayer, get_player_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)我的练气$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await get_player_img(e)
  if (img) Send(Image(img))
  return false
})
