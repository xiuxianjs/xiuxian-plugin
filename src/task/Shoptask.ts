import { data } from '@src/model/api'
import { readShop, writeShop } from '@src/model/shop'

/**
 * 读取当前商店数据（shop）。
遍历每个商品，将其 one（商品内容）和 price（价格）字段，刷新为 data.shop_list 中的最新配置。
更新后的商店数据写回存储。
 */
export const Shoptask = async () => {
  const shop = await readShop()
  for (let i = 0; i < shop.length; i++) {
    shop[i].one = data.shop_list[i].one
    shop[i].price = data.shop_list[i].price
  }
  await writeShop(shop)
}
