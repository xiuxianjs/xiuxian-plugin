/* 商店相关函数抽离 */
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import { getIoRedis } from '@alemonjs/db'
import type { ShopThing, ShopData } from '../types/model'

const redis = getIoRedis()

export async function writeShop(shop: ShopData) {
  await redis.set(`${__PATH.shop}:shop`, JSON.stringify(shop))
}

export async function readShop(): Promise<ShopData> {
  const shop = await redis.get(`${__PATH.shop}:shop`)
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
