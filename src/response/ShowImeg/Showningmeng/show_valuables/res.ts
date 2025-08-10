import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getValuablesImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?万宝楼$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const img = await getValuablesImage(e)
  if (img) Send(Image(img))
})
