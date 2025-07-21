import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import Help from 'model/help'
import { cache } from '../../help'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)?修仙帮助$/

export default onResponse(selects, async e => {
  logger.info('修仙帮助')

  const Send = useSend(e)
  let data = await Help.get(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  if (img) Send(Image(img))
})
