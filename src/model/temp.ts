// 临时数据存取逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'

const redis = getIoRedis()

export type TempRecord = any // 兼容旧逻辑，后续细化

export async function readTemp(): Promise<TempRecord[]> {
  const temp = await redis.get(`${__PATH.temp_path}:temp`)
  if (!temp) return []
  return safeParse(temp, [])
}

export async function writeTemp(list: TempRecord[]) {
  await redis.set(`${__PATH.temp_path}:temp`, JSON.stringify(list))
}

export default { readTemp, writeTemp }
