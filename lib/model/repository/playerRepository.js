import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';

const redis = getIoRedis();
function createPlayerRepository(getOccupationTable) {
    return {
        async get(id) {
            const raw = await redis.get(keys.player(id));
            if (!raw)
                return null;
            try {
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        },
        async save(id, player) {
            await redis.set(keys.player(id), JSON.stringify(player));
        },
        async exists(id) {
            const n = await redis.exists(keys.player(id));
            return n === 1;
        },
        async addOccupationExp(id, delta) {
            if (delta === 0)
                return null;
            const player = await this.get(id);
            if (!player)
                return null;
            const occupationTable = getOccupationTable();
            let occExp = Number(player.occupation_exp || 0);
            let occLevel = Number(player.occupation_level || 1);
            occExp = occExp + delta;
            while (true) {
                const expRow = occupationTable.find(row => row.id === occLevel);
                if (!expRow || expRow.experience > occExp)
                    break;
                occExp = occExp - expRow.experience;
                occLevel = occLevel + 1;
            }
            player.occupation_exp = occExp;
            player.occupation_level = occLevel;
            await this.save(id, player);
            return { level: occLevel, exp: occExp };
        }
    };
}

export { createPlayerRepository };
