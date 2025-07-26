import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getForumImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let thing_class = e.MessageText.replace(/^(#|＃|\/)?聚宝堂/, '')
  let img = await getForumImage(e, thing_class)
  if (img) Send(Image(img))
})
