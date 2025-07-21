import { data } from '@src/api/api'
import { Read_shop, Write_shop } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 21 ? * 1,5', async () => {
  let shop = await Read_shop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].one = data.shop_list[i].one
    shop[i].price = data.shop_list[i].price
  }
  await Write_shop(shop)
})
