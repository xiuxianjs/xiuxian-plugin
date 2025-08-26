import { keys } from '../keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../DataControl.js';

function safeParse(s, fallback) {
    if (!s) {
        return fallback;
    }
    try {
        return JSON.parse(s);
    }
    catch {
        return fallback;
    }
}
class PlayerRepo {
    getRaw(id) {
        return getDataJSONParseByKey(keys.player(id));
    }
    async getObject(id) {
        const raw = await this.getRaw(id);
        if (!raw) {
            return null;
        }
        return safeParse(raw, null);
    }
    async setObject(id, obj) {
        await setDataJSONStringifyByKey(keys.player(id), obj);
    }
    async atomicAdjust(id, field, delta) {
        if (!delta) {
            return null;
        }
        const obj = await this.getObject(id);
        if (!obj) {
            return null;
        }
        if (Array.isArray(obj)) {
            return null;
        }
        const current = Number(obj[field] ?? 0);
        const newValue = current + delta;
        obj[field] = newValue;
        await this.setObject(id, obj);
        return newValue;
    }
}
const playerRepo = new PlayerRepo();

export { PlayerRepo, playerRepo, safeParse };
