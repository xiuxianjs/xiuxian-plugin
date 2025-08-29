import { keys } from '../keys.js';
import type { PlayerRepository, OccupationExpRow } from '../../types/model';
import { existDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey } from '../DataControl.js';

export function createPlayerRepository(getOccupationTable: () => OccupationExpRow[]): PlayerRepository {
  return {
    get(id) {
      return getDataJSONParseByKey(keys.player(id));
    },
    async save(id, player) {
      await setDataJSONStringifyByKey(keys.player(id), player);
    },
    async exists(id) {
      return await existDataByKey(keys.player(id));
    },
    async addOccupationExp(id, delta) {
      if (delta === 0) {
        return null;
      }

      // 传统的读取-修改-写入方式
      const player = await this.get(id);

      if (!player) {
        return null;
      }

      const occupationTable = getOccupationTable();
      let occExp = Number(player.occupation_exp ?? 0);
      let occLevel = Number(player.occupation_level ?? 0);

      occExp = occExp + delta;

      // 处理升级逻辑
      while (true) {
        const expRow = occupationTable.find(row => row.id === occLevel);
        const nextRow = occupationTable.find(row => row.id === occLevel + 1);

        if (!expRow || !nextRow || expRow.experience > occExp) {
          break;
        }

        occExp = occExp - expRow.experience;
        occLevel = occLevel + 1;
      }

      // 更新玩家数据
      player.occupation_exp = occExp;
      player.occupation_level = occLevel;

      // 保存回 Redis
      await this.save(id, player);

      return { level: occLevel, exp: occExp };
    }
  };
}
