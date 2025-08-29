import { redis } from '../../model/api';
import { getRedisKey } from '../keys';
import type { RedisScalar } from '../../types/model';
import { getDataJSONParseByKey, setDataByKey, setDataJSONStringifyByKey } from '../DataControl';
import { ActionType } from '@src/types/keys';

// 通用获取：保留字符串或 null
export function getString(key: string): Promise<RedisScalar> {
  return redis.get(key);
}

// 获取并转 number（无法转换返回 null）
export async function getNumber(key: string): Promise<number | null> {
  const v = await redis.get(key);

  if (v === null) {
    return null;
  }
  const n = Number(v);

  return Number.isNaN(n) ? null : n;
}

// 获取并 JSON.parse（失败返回 null）
export function getJSON<T = unknown>(key: string): Promise<T | null> {
  return getDataJSONParseByKey(key);
}

// set：自动 stringify 对象
export async function setValue(key: string, value): Promise<void> {
  if (typeof value === 'string') {
    await setDataByKey(key, value);
  } else {
    await setDataJSONStringifyByKey(key, value);
  }
}

// 数值自增（不存在时初始化为 delta 或 0）
export async function incrBy(key: string, delta = 1): Promise<number> {
  const current = await getNumber(key);
  const next = (current ?? 0) + delta;

  await redis.set(key, String(next));

  return next;
}

// 构建玩家 key（兼容旧用法，推荐直接用 getRedisKey）
export function userKey(userId: string | number, suffix: ActionType) {
  return getRedisKey(String(userId), suffix);
}

// 读取带时间戳并返回 number
export function getTimestamp(userId: string | number, suffix: ActionType) {
  return getNumber(userKey(userId, suffix));
}

// 设置当前时间戳
export async function setTimestamp(userId: string | number, suffix: ActionType, ts: number = Date.now()) {
  await redis.set(userKey(userId, suffix), String(ts));
}

export type { RedisScalar };
