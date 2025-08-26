import { keys } from '../keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../DataControl.js';

function createNajieRepository() {
    return {
        get(id) {
            return getDataJSONParseByKey(keys.najie(id));
        },
        async save(id, value) {
            await setDataJSONStringifyByKey(keys.najie(id), value);
        },
        async addLingShi(id, delta) {
            if (delta === 0) {
                return null;
            }
            const obj = await getDataJSONParseByKey(keys.najie(id));
            if (!obj) {
                return null;
            }
            const cur = typeof obj['灵石'] === 'number' ? obj['灵石'] : 0;
            const next = cur + delta;
            if (next < 0) {
                return null;
            }
            obj['灵石'] = next;
            await setDataJSONStringifyByKey(keys.najie(id), obj);
            return next;
        }
    };
}

export { createNajieRepository };
