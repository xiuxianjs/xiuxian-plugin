import { Image, useSend } from 'alemonjs'

import { cache } from '../../help'
import Help from '@src/model/help'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门管理$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const data = await Help.Association(e)
  if (!data) return false
  const img = await cache(data, e.UserId)
  await Send(Image(img))
})
