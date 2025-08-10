/* 交易/拍卖相关函数抽离 */
import { __PATH } from './paths.js'
import { getIoRedis } from '@alemonjs/db'
import data from './XiuxianData.js'
import { safeParse } from './utils/safe.js'
import type { AuctionItem } from '../types/data_extra'

// 拍卖 / 交易结构类型声明
export interface ExchangeThingSnapshot {
  name?: string
  名号?: string
  class?: string
  type?: string
  出售价?: number
  pinji?: number | string
  [k: string]: unknown
}
export interface ExchangeRecord {
  thing: ExchangeThingSnapshot
  start_price: number
  last_price: number
  amount: number
  last_offer_price: number
  last_offer_player: number | string
  groupList: string[]
  [k: string]: unknown
}
export type ForumRecord = ExchangeRecord

const redis = getIoRedis()

export async function writeExchange(wupin: ExchangeRecord[]): Promise<void> {
  await redis.set(`${__PATH.Exchange}:Exchange`, JSON.stringify(wupin))
}
export async function writeForum(wupin: ForumRecord[]): Promise<void> {
  await redis.set(`${__PATH.Exchange}:Forum`, JSON.stringify(wupin))
}
export async function readExchange(): Promise<ExchangeRecord[]> {
  const Exchange = await redis.get(`${__PATH.Exchange}:Exchange`)
  if (!Exchange) return []
  return safeParse<ExchangeRecord[]>(Exchange, [])
}
export async function readForum(): Promise<ForumRecord[]> {
  const Forum = await redis.get(`${__PATH.Exchange}:Forum`)
  if (!Forum) return []
  return safeParse<ForumRecord[]>(Forum, [])
}
export async function openAU(): Promise<ExchangeRecord> {
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const xinggeFirst = data.xingge?.[0]
  const oneList = (xinggeFirst?.one || []) as AuctionItem[]
  if (oneList.length === 0) throw new Error('星阁拍卖行数据为空')
  const random = Math.floor(Math.random() * oneList.length)
  const thing_data = oneList[random]
  const thing_value = Math.floor(Number(thing_data.出售价) || 0)
  const thing_amount = 1
  const now_time = Date.now()
  const groupList = await redis.smembers(redisGlKey)
  const wupin: ExchangeRecord = {
    thing: thing_data,
    start_price: thing_value,
    last_price: thing_value,
    amount: thing_amount,
    last_offer_price: now_time,
    last_offer_player: 0,
    groupList
  }
  await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin))
  return wupin
}

export default { writeExchange, writeForum, readExchange, readForum, openAU }
