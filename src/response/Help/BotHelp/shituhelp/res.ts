import { Image, useSend } from 'alemonjs'
import Help2 from '@src/model/shituhelp'
import { cache } from '../../help'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?师徒帮助$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const data = await Help2.shituhelp(e)
  if (!data) return false
  const img = await cache(data, e.UserId)
  await Send(Image(img))
})
