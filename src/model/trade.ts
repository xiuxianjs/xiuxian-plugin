/* 交易/拍卖相关函数抽离 */
import { __PATH } from './paths.js'
import { getIoRedis } from '@alemonjs/db'
import data from './XiuxianData.js'
import { safeParse } from './utils/safe.js'

const redis = getIoRedis()

export async function writeExchange(wupin) {
  await redis.set(`${__PATH.Exchange}:Exchange`, JSON.stringify(wupin))
}
export async function writeForum(wupin) {
  await redis.set(`${__PATH.Exchange}:Forum`, JSON.stringify(wupin))
}
export async function readExchange() {
  const Exchange = await redis.get(`${__PATH.Exchange}:Exchange`)
  if (!Exchange) return []
  return safeParse(Exchange, [])
}
export async function readForum() {
  const Forum = await redis.get(`${__PATH.Exchange}:Forum`)
  if (!Forum) return []
  return safeParse(Forum, [])
}
export async function openAU() {
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const random = Math.floor(Math.random() * data.xingge[0].one.length)
  const thing_data = data.xingge[0].one[random]
  const thing_value = Math.floor(thing_data.出售价)
  const thing_amount = 1
  const now_time = Date.now()
  const groupList = await redis.smembers(redisGlKey)
  const wupin = {
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
