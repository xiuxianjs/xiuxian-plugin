// 丹药存取逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'
import { readAll } from './duanzaofu.js'
import type { DanyaoItem } from '../types/model'

const redis = getIoRedis()

/**
 * 读取玩家丹药列表。
 * 兼容旧版本：历史上可能以“单个对象(聚合状态)”形式存储，而不是数组。
 * 如果解析结果不是数组，则包装为数组；若是 null/其它类型，返回空数组。
 */
export async function readDanyao(userId: string): Promise<DanyaoItem[]> {
  const raw = await redis.get(`${__PATH.danyao_path}:${userId}`)
  if (!raw) return []
  const parsed = safeParse<unknown>(raw, [])
  if (Array.isArray(parsed)) return parsed as DanyaoItem[]
  if (parsed && typeof parsed === 'object') {
    // 旧格式：聚合对象，没有 count/name/type 等字段时补齐基础字段，避免后续逻辑崩溃
    const legacy = parsed as Record<string, unknown>
    const item: DanyaoItem = {
      name: (legacy.name as string) || '聚合丹药',
      class: '丹药',
      type: (legacy.type as string) || '聚合',
      count: (legacy.count as number) || 1,
      // 将可能存在的效果字段原样附加
      ...legacy
    } as unknown as DanyaoItem
    return [item]
  }
  return []
}

export async function writeDanyao(userId: string, list: DanyaoItem[]) {
  await redis.set(`${__PATH.danyao_path}:${userId}`, JSON.stringify(list))
}

export { readAll }
export default { readDanyao, writeDanyao, readAll }
