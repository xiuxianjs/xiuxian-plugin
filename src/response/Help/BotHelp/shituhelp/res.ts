import { Image, useSend } from 'alemonjs'
import Help2 from '@src/model/shituhelp'
import { cache } from '../../help'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)师徒帮助$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let data = await Help2.shituhelp(e)
  if (!data) return false
  let img = await cache(data, e.UserId)
  await Send(Image(img))
})
