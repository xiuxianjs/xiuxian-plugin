import { getIoRedis } from '@alemonjs/db'
import type { Player } from '../../types/player.js'
import { keys } from './keys.js'

const redis = getIoRedis()

export interface PlayerRepository {
  get(id: string): Promise<Player | null>
  save(id: string, player: Player): Promise<void>
  exists(id: string): Promise<boolean>
  // 原子增加职业经验
  addOccupationExp(
    id: string,
    delta: number
  ): Promise<{ level: number; exp: number } | null>
}

// 经验表 item 类型（减少对 data 的直接耦合）
interface OccupationExpRow {
  id: number
  experience: number
}

export function createPlayerRepository(
  getOccupationTable: () => OccupationExpRow[]
): PlayerRepository {
  return {
    async get(id) {
      const raw = await redis.get(keys.player(id))
      if (!raw) return null
      try {
        return JSON.parse(raw) as Player
      } catch {
        return null
      }
    },
    async save(id, player) {
      await redis.set(keys.player(id), JSON.stringify(player))
    },
    async exists(id) {
      const n = await redis.exists(keys.player(id))
      return n === 1
    },
    async addOccupationExp(id, delta) {
      if (delta === 0) return null
      // 使用 Lua 实现原子读取 + 升级计算
      const script = `
local k = KEYS[1]
local delta = tonumber(ARGV[1])
local tblJson = ARGV[2]
local data = redis.call('GET', k)
if not data then return nil end
local ok, player = pcall(cjson.decode, data)
if not ok then return nil end
local occExp = tonumber(player['occupation_exp'] or 0)
local occLevel = tonumber(player['occupation_level'] or 1)
local expTable = cjson.decode(tblJson)
occExp = occExp + delta
while true do
  local need = nil
  for i=1,#expTable do
    local row = expTable[i]
    if tonumber(row.id) == occLevel then need = tonumber(row.experience); break end
  end
  if (not need) or (need > occExp) then break end
  occExp = occExp - need
  occLevel = occLevel + 1
end
player['occupation_exp'] = occExp
player['occupation_level'] = occLevel
redis.call('SET', k, cjson.encode(player))
return occLevel .. ':' .. occExp
`
      const occupationTable = getOccupationTable()
      const evalResult = (await redis.eval(
        script,
        1,
        keys.player(id),
        String(delta),
        JSON.stringify(occupationTable)
      )) as unknown
      const res: string | null =
        typeof evalResult === 'string' ? evalResult : null
      if (!res) return null
      const [levelStr, expStr] = res.split(':')
      return { level: Number(levelStr), exp: Number(expStr) }
    }
  }
}
