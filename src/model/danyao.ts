// 丹药存取逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import { readAll } from './duanzaofu.js'

const redis = getIoRedis()

export interface DanyaoItem {
  name: string
  count: number
  // 其他可能字段保留 any 兼容, 后续补完类型
  [k: string]: any
}

export async function readDanyao(userId: string): Promise<DanyaoItem[]> {
  const danyao = await redis.get(`${__PATH.danyao_path}:${userId}`)
  if (!danyao) return []
  return safeParse(danyao, [])
}

export async function writeDanyao(userId: string, list: DanyaoItem[]) {
  await redis.set(`${__PATH.danyao_path}:${userId}`, JSON.stringify(list))
}

export { readAll }
export default { readDanyao, writeDanyao, readAll }
