import { Image, useSend } from 'alemonjs'

import Help from '@src/model/help'
import { cache } from '../../help'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?修仙管理$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const data = await Help.setup()
  if (!data) return false
  const img = await cache(data, e.UserId)
  await Send(Image(img))
})
