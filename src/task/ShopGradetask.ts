import { readShop, writeShop } from '@src/model/shop'
import { scheduleJob } from 'node-schedule'
import type { ShopData, ShopSlot } from '@src/types'

scheduleJob('0 59 20 * * ?', async () => {
  const shop = (await readShop()) as ShopData
  for (const slot of shop as Array<ShopSlot & { Grade?: number }>) {
    const current = Number(slot.Grade || 1)
    slot.Grade = current - 1
    if (slot.Grade < 1) slot.Grade = 1
  }
  await writeShop(shop)
})
