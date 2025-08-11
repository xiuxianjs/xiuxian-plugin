import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './paths.js';
import { safeParse } from './utils/safe.js';
import { readAll } from './duanzaofu.js';

const redis = getIoRedis();
async function readDanyao(userId) {
    const danyao = await redis.get(`${__PATH.danyao_path}:${userId}`);
    if (!danyao)
        return [];
    return safeParse(danyao, []);
}
async function writeDanyao(userId, list) {
    await redis.set(`${__PATH.danyao_path}:${userId}`, JSON.stringify(list));
}
var danyao = { readDanyao, writeDanyao, readAll };

export { danyao as default, readAll, readDanyao, writeDanyao };
