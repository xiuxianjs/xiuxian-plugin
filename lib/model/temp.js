import { getIoRedis } from '@alemonjs/db';
import { safeParse } from './utils/safe.js';
import { keys } from './keys.js';

async function readTemp() {
    const redis = getIoRedis();
    const temp = await redis.get(keys.temp('temp'));
    if (!temp)
        return [];
    return safeParse(temp, []);
}
async function writeTemp(list) {
    const redis = getIoRedis();
    await redis.set(keys.temp('temp'), JSON.stringify(list));
}
var temp = { readTemp, writeTemp };

export { temp as default, readTemp, writeTemp };
