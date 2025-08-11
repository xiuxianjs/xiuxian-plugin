import { redis } from '../../model/api'
import type { RedisScalar } from '../../types/model'

// 通用获取：保留字符串或 null
export async function getString(key: string): Promise<RedisScalar> {
  return redis.get(key)
}

// 获取并转 number（无法转换返回 null）
export async function getNumber(key: string): Promise<number | null> {
  const v = await redis.get(key)
  if (v == null) return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

// 获取并 JSON.parse（失败返回 null）
export async function getJSON<T = unknown>(key: string): Promise<T | null> {
  const v = await redis.get(key)
  if (v == null) return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

// set：自动 stringify 对象
export async function setValue(key: string, value: unknown): Promise<void> {
  if (typeof value === 'string') await redis.set(key, value)
  else await redis.set(key, JSON.stringify(value))
}

// 数值自增（不存在时初始化为 delta 或 0）
export async function incrBy(key: string, delta = 1): Promise<number> {
  const current = await getNumber(key)
  const next = (current ?? 0) + delta
  await redis.set(key, String(next))
  return next
}

// 构建玩家 key
export function userKey(userId: string | number, suffix: string) {
  return `xiuxian@1.3.0:${userId}:${suffix}`
}

// 读取带时间戳并返回 number
export async function getTimestamp(userId: string | number, suffix: string) {
  return getNumber(userKey(userId, suffix))
}

// 设置当前时间戳
export async function setTimestamp(
  userId: string | number,
  suffix: string,
  ts: number = Date.now()
) {
  await redis.set(userKey(userId, suffix), String(ts))
}

export type { RedisScalar }
