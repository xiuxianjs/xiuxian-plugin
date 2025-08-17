import { getIoRedis } from '@alemonjs/db'
import type { Player } from '../../types/player.js'
import { keys } from '../keys.js'
import type { PlayerRepository, OccupationExpRow } from '../../types/model'

const redis = getIoRedis()

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

      // 传统的读取-修改-写入方式
      const player = await this.get(id)
      if (!player) return null

      const occupationTable = getOccupationTable()
      let occExp = Number(player.occupation_exp || 0)
      let occLevel = Number(player.occupation_level || 0)

      occExp = occExp + delta

      // 处理升级逻辑
      while (true) {
        const expRow = occupationTable.find(row => row.id === occLevel)
        if (!expRow || expRow.experience > occExp) break

        occExp = occExp - expRow.experience
        occLevel = occLevel + 1
      }

      // 更新玩家数据
      player.occupation_exp = occExp
      player.occupation_level = occLevel

      // 保存回 Redis
      await this.save(id, player)

      return { level: occLevel, exp: occExp }
    }
  }
}
