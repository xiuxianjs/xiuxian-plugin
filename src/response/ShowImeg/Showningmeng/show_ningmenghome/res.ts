import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getNingmenghomeImage } from '@src/model/image'

export const regular =
  /^(#|＃|\/)?柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const thing_type = e.MessageText.replace(/^(#|＃|\/)?柠檬堂/, '')
  const img = await getNingmenghomeImage(e, thing_type)
  if (img) Send(Image(img))
})
