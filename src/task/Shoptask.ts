import { data } from '@src/api/api'
import { readShop, writeShop } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 21 ? * 1,5', async () => {
  let shop = await readShop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].one = data.shop_list[i].one
    shop[i].price = data.shop_list[i].price
  }
  await writeShop(shop)
})
