// 临时数据存取逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './keys.js'
import { safeParse } from './utils/safe.js'
import type { TempRecord } from '../types/model'
import { keys } from './keys.js'

export async function readTemp(): Promise<TempRecord[]> {
  const redis = getIoRedis()
  const temp = await redis.get(keys.temp('temp'))
  if (!temp) return []
  return safeParse(temp, [])
}

export async function writeTemp(list: TempRecord[]) {
  const redis = getIoRedis()
  await redis.set(keys.temp('temp'), JSON.stringify(list))
}

export default { readTemp, writeTemp }
