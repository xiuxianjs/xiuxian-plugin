import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '../keys.js'

export function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

// 简易 Player Repository (保持字段命名兼容，不改动原结构)
export class PlayerRepo {
  private redis = getIoRedis()
  async getRaw(id: string) {
    return this.redis.get(`${__PATH.player_path}:${id}`)
  }
  async getObject<T>(id: string): Promise<T | null> {
    const raw = await this.getRaw(id)
    if (!raw) return null
    return safeParse<T | null>(raw, null)
  }
  async setObject<T extends object | unknown>(id: string, obj: T) {
    await this.redis.set(`${__PATH.player_path}:${id}`, JSON.stringify(obj))
  }
  // 原子数值增减（字符串化 JSON 方式，不拆字段；若需高并发可改 hash 结构）
  async atomicAdjust(
    id: string,
    field: string,
    delta: number
  ): Promise<number | null> {
    if (!delta) return null

    // 传统的读取-修改-写入方式
    const obj = await this.getObject<Record<string, unknown>>(id)
    if (!obj) return null

    // 若 obj 是数组，直接返回 null，避免数组被当作对象处理
    if (Array.isArray(obj)) return null

    const current = Number(obj[field] || 0)
    const newValue = current + delta
    obj[field] = newValue

    await this.setObject(id, obj)
    return newValue
  }
}

export const playerRepo = new PlayerRepo()
