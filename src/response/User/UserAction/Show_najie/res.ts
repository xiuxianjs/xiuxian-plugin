import { Image, useSend } from 'alemonjs'

import { existplayer, get_najie_img } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)我的纳戒$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let img = await get_najie_img(e)
  if (img) Send(Image(img))
})
