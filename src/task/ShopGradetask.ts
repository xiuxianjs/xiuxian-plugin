import { Read_shop, Write_shop } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 59 20 * * ?', async () => {
  let shop = await Read_shop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].Grade--
    if (shop[i].Grade < 1) {
      shop[i].Grade = 1
    }
  }
  await Write_shop(shop)
})
