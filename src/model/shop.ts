/* 商店相关函数抽离 */
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import { getIoRedis } from '@alemonjs/db'
import type { ShopThing, ShopData } from '../types/model'
import { keys } from './keys.js'

export async function writeShop(shop: ShopData) {
  const redis = getIoRedis()
  await redis.set(keys.shop('shop'), JSON.stringify(shop))
}

export async function readShop(): Promise<ShopData> {
  const redis = getIoRedis()
  const shop = await redis.get(keys.shop('shop'))
  if (!shop) return []
  return safeParse<ShopData>(shop, [])
}

export async function existshop(didian: string): Promise<ShopThing[] | false> {
  const shop = await readShop()
  const slot = shop.find(s => s.name == didian)
  if (!slot) return false
  const available = slot.one.filter(t => t.数量 > 0)
  return available.length > 0 ? available : false
}

export default { writeShop, readShop, existshop }
