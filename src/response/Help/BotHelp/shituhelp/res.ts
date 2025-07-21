import { createSelects, Image, Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import Help2 from 'model/shituhelp'
import { cache } from '../../help'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)师徒帮助$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('维护中'))
  return false
  let data = await Help2.shituhelp(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
