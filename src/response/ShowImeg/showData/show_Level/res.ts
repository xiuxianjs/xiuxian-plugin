import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getStateImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?练气境界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let img = await getStateImage(e, null)
  if (img) Send(Image(img))
})
