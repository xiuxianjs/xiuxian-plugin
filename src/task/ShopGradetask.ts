import { readShop, writeShop } from '@src/model/shop'
import type { ShopData, ShopSlot } from '@src/types'

export const ShopGradetask = async () => {
  const shop = (await readShop()) as ShopData
  for (const slot of shop as Array<ShopSlot & { Grade?: number }>) {
    const current = Number(slot.Grade || 1)
    slot.Grade = current - 1
    if (slot.Grade < 1) slot.Grade = 1
  }
  await writeShop(shop)
}
