import { Image, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import Help from 'model/help'
import { cache } from '../../help'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)修仙管理$/

export default onResponse(selects, async e => {
  logger.info(await e.UserAvatar.toURL())
  const Send = useSend(e)
  let data = await Help.setup(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
