import { Image, useSend } from 'alemonjs'

import Help from '@src/model/help'
import { cache } from '../../help'

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
