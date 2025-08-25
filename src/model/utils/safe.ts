import { getIoRedis } from '@alemonjs/db';
import { keys } from '../keys.js';

export function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) {
    return fallback;
  }
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export class PlayerRepo {
  private redis = getIoRedis();
  getRaw(id: string) {
    return this.redis.get(keys.player(id));
  }
  async getObject<T>(id: string): Promise<T | null> {
    const raw = await this.getRaw(id);

    if (!raw) {
      return null;
    }

    return safeParse<T | null>(raw, null);
  }
  async setObject<T extends object | unknown>(id: string, obj: T) {
    await this.redis.set(keys.player(id), JSON.stringify(obj));
  }
  async atomicAdjust(id: string, field: string, delta: number): Promise<number | null> {
    if (!delta) {
      return null;
    }

    const obj = await this.getObject<Record<string, unknown>>(id);

    if (!obj) {
      return null;
    }

    if (Array.isArray(obj)) {
      return null;
    }

    const current = Number(obj[field] || 0);
    const newValue = current + delta;

    obj[field] = newValue;

    await this.setObject(id, obj);

    return newValue;
  }
}

export const playerRepo = new PlayerRepo();
