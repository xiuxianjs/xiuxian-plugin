import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './paths.js';
import { safeParse } from './utils/safe.js';

const redis = getIoRedis();
async function readTemp() {
    const temp = await redis.get(`${__PATH.temp_path}:temp`);
    if (!temp)
        return [];
    return safeParse(temp, []);
}
async function writeTemp(list) {
    await redis.set(`${__PATH.temp_path}:temp`, JSON.stringify(list));
}
var temp = { readTemp, writeTemp };

export { temp as default, readTemp, writeTemp };
