// 临时数据存取逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import type { TempRecord } from '../types/model'

const redis = getIoRedis()

export async function readTemp(): Promise<TempRecord[]> {
  const temp = await redis.get(`${__PATH.temp_path}:temp`)
  if (!temp) return []
  return safeParse(temp, [])
}

export async function writeTemp(list: TempRecord[]) {
  await redis.set(`${__PATH.temp_path}:temp`, JSON.stringify(list))
}

export default { readTemp, writeTemp }
