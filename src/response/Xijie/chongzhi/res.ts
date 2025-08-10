import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { readShop, writeShop } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?重置.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  let didian = e.MessageText.replace(/^(#|＃|\/)?重置/, '')
  didian = didian.trim()
  let shop
  try {
    shop = await readShop()
  } catch {
    await writeShop(data.shop_list)
    shop = await readShop()
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
  await writeShop(shop)
  Send(Text('重置成功!'))
})
