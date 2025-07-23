import { Image, useSend } from 'alemonjs'

import Help from '@src/model/help'
import { cache } from '../../help'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)?修仙帮助$/

export default onResponse(selects, async e => {
  logger.info('修仙帮助')

  const Send = useSend(e)
  let data = await Help.get()
  if (!data) return false
  let img = await cache(data, e.UserId)
  if (img) Send(Image(img))
})
