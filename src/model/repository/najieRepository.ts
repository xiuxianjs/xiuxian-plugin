import { getIoRedis } from '@alemonjs/db'
import { keys } from './keys.js'
import type { Najie } from '../../types/player.js'
import type { NajieRepository } from '../../types/model'

const redis = getIoRedis()

export function createNajieRepository(): NajieRepository {
  return {
    async get(id) {
      const raw = await redis.get(keys.najie(id))
      if (!raw) return null
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    },
    async save(id, value) {
      await redis.set(keys.najie(id), JSON.stringify(value))
    },
    async addLingShi(id, delta) {
      if (delta === 0) return null
      // 旧实现：直接读取-修改-写回（非原子，仅用于简单场景）
      const raw = await redis.get(keys.najie(id))
      if (!raw) return null
      let obj: Najie & { [k: string]: unknown }
      try {
        obj = JSON.parse(raw)
      } catch {
        return null
      }
      const cur = typeof obj['灵石'] === 'number' ? obj['灵石'] : 0
      const next = cur + delta
      if (next < 0) return null
      obj['灵石'] = next
      await redis.set(keys.najie(id), JSON.stringify(obj))
      return next
    }
  }
}
