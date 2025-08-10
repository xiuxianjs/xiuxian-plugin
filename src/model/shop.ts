/* 商店相关函数抽离 */
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import { getIoRedis } from '@alemonjs/db'

const redis = getIoRedis()

export async function writeShop(shop) {
  await redis.set(`${__PATH.shop}:shop`, JSON.stringify(shop))
}

export async function readShop() {
  const shop = await redis.get(`${__PATH.shop}:shop`)
  if (!shop) return []
  return safeParse(shop, [])
}

export async function existshop(didian) {
  const shop: any = await readShop()
  let i
  const thing: any[] = []
  for (i = 0; i < shop.length; i++) if (shop[i].name == didian) break
  for (let j = 0; j < shop[i].one.length; j++)
    if (shop[i].one[j].数量 > 0) thing.push(shop[i].one[j])
  return thing.length > 0 ? thing : false
}

export default { writeShop, readShop, existshop }
