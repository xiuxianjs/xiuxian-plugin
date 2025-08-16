import { data } from '@src/model/api'
import { readShop, writeShop } from '@src/model/shop'
export const Shoptask = async () => {
  const shop = await readShop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].one = data.shop_list[i].one
    shop[i].price = data.shop_list[i].price
  }
  await writeShop(shop)
}
