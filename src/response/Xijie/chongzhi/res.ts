import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from '@src/api/api'
import { Read_shop, Write_shop } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)重置.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  let didian = e.MessageText.replace('#重置', '')
  didian = didian.trim()
  let shop
  try {
    shop = await Read_shop()
  } catch {
    await Write_shop(data.shop_list)
    shop = await Read_shop()
  }
  let i
  for (i = 0; i < shop.length; i++) {
    if (shop[i].name == didian) {
      break
    }
  }
  if (i == shop.length) {
    return false
  }
  shop[i].state = 0
  await Write_shop(shop)
  Send(Text('重置成功!'))
})
