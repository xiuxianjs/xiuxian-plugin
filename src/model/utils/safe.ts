import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '../paths.js'

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
    // 使用 Lua：读取 -> 修改 -> 写回；避免读改写竞态
    const lua = `
  local key = KEYS[1]
  local field = ARGV[1]
  local delta = tonumber(ARGV[2])
  local raw = redis.call('GET', key)
  if not raw then return nil end
  local ok, obj = pcall(cjson.decode, raw)
  if not ok or type(obj) ~= 'table' then return nil end
  -- 若 obj 是数组（#obj > 0），直接返回 nil，避免数组被当作对象处理
  if #obj > 0 then return nil end
  local cur = obj[field] or 0
  cur = cur + delta
  obj[field] = cur
  redis.call('SET', key, cjson.encode(obj))
  return cur
`
    // ...existing code...
    const key = `${__PATH.player_path}:${id}`
    const redisClientTyped = this.redis as unknown as {
      eval: (
        script: string,
        numKeys: number,
        key: string,
        field: string,
        delta: number
      ) => Promise<number | null | string>
    }
    const res = await redisClientTyped.eval(lua, 1, key, field, delta)
    return typeof res === 'number' ? res : res == null ? null : Number(res)
  }
}

export const playerRepo = new PlayerRepo()
