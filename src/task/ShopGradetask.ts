import { readShop, writeShop } from '@src/model/shop'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 59 20 * * ?', async () => {
  const shop = await readShop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].Grade--
    if (shop[i].Grade < 1) {
      shop[i].Grade = 1
    }
  }
  await writeShop(shop)
})
