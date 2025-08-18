import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { readShop, writeShop } from '@src/model/index'
import type { ShopData } from '@src/types'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?重置.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false

  const didian = e.MessageText.replace(/^(#|＃|\/)?重置/, '').trim()
  if (!didian) {
    Send(Text('请在指令后填写要重置的商店名称'))
    return false
  }

  let shop: ShopData
  try {
    shop = await readShop()
  } catch {
    await writeShop(data.shop_list as ShopData)
    shop = await readShop()
  }

  const idx = shop.findIndex(s => s.name === didian)
  if (idx === -1) return false

  type ShopSlot = ShopData[number]
  type ShopSlotWithState = ShopSlot & { state?: number }
  const slot = shop[idx] as ShopSlotWithState
  slot.state = 0
  await writeShop(shop as ShopData)
  Send(Text(`重置成功: ${didian}`))
  return false
})
