import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';

const redis = getIoRedis();
function createNajieRepository() {
    return {
        async get(id) {
            const raw = await redis.get(keys.najie(id));
            if (!raw)
                return null;
            try {
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        },
        async save(id, value) {
            await redis.set(keys.najie(id), JSON.stringify(value));
        },
        async addLingShi(id, delta) {
            if (delta === 0)
                return null;
            const raw = await redis.get(keys.najie(id));
            if (!raw)
                return null;
            let obj;
            try {
                obj = JSON.parse(raw);
            }
            catch {
                return null;
            }
            const cur = typeof obj['灵石'] === 'number' ? obj['灵石'] : 0;
            const next = cur + delta;
            if (next < 0)
                return null;
            obj['灵石'] = next;
            await redis.set(keys.najie(id), JSON.stringify(obj));
            return next;
        }
    };
}

export { createNajieRepository };
