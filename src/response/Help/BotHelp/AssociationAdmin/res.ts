import { Image, useSend } from 'alemonjs'

import { cache } from '../../help'
import Help from '@src/model/help'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)宗门管理$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let data = await Help.Association(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
