import { getIoRedis } from '@alemonjs/db'
import { keys } from './keys.js'
import type { Najie } from '../../types/player.js'

const redis = getIoRedis()

export interface NajieRepository {
  get(id: string): Promise<Najie | null>
  save(id: string, value: Najie): Promise<void>
  addLingShi(id: string, delta: number): Promise<number | null>
}

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
      const script = `
local k = KEYS[1]
local d = tonumber(ARGV[1])
local raw = redis.call('GET', k)
if not raw then return nil end
local ok, obj = pcall(cjson.decode, raw)
if not ok then return nil end
local cur = tonumber(obj['灵石'] or 0)
cur = cur + d
if cur < 0 then return -1 end
obj['灵石'] = cur
redis.call('SET', k, cjson.encode(obj))
return cur
`
      const res = (await redis.eval(
        script,
        1,
        keys.najie(id),
        String(delta)
      )) as unknown
      if (typeof res !== 'number') return null
      if (res === -1) return null
      return res
    }
  }
}
