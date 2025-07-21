import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { cache } from '../../help'
import Help from 'model/help'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)修仙扩展$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let data = await Help.gethelpcopy(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
