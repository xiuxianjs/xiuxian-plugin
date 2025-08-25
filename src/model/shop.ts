/* 商店相关函数抽离 */
import type { ShopThing, ShopData } from '../types/model';
import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

export async function writeShop (shop: ShopData) {
  await setDataJSONStringifyByKey(keys.shop('shop'), shop);
}

export async function readShop (): Promise<ShopData> {
  const shop = await getDataJSONParseByKey(keys.shop('shop'));
  if (!shop) return [];
  return shop;
}

export async function existshop (didian: string): Promise<ShopThing[] | false> {
  const shop = await readShop();
  const slot = shop.find(s => s.name == didian);
  if (!slot) return false;
  const available = slot.one.filter(t => t.数量 > 0);
  return available.length > 0 ? available : false;
}

export default { writeShop, readShop, existshop };
