import { Image, useSend } from 'alemonjs'

import { cache } from '../../help'
import Help from '@src/model/help'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?修仙扩展$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let data = await Help.gethelpcopy()
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
