import { getDataList } from '@src/model/DataList';
import { readShop, writeShop } from '@src/model/shop';

/**
 * 读取当前商店数据（shop）。
遍历每个商品，将其 one（商品内容）和 price（价格）字段，刷新为 getDataList('Shop') 中的最新配置。
更新后的商店数据写回存储。
 */
export const Shoptask = async () => {
  const shop = await readShop();
  const shopList = await getDataList('Shop');
  for (let i = 0; i < shop.length; i++) {
    shop[i].one = shopList[i].one;
    shop[i].price = shopList[i].price;
  }
  await writeShop(shop);
};
