import { getIoRedis } from '@alemonjs/db';
import { readAll } from './duanzaofu.js';
import { keys } from './keys.js';

const baseData = {
    biguan: 0,
    biguanxl: 0,
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0,
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
};
async function readDanyao(userId) {
    const redis = getIoRedis();
    const raw = await redis.get(keys.danyao(userId));
    if (!raw) {
        await writeDanyao(userId, baseData);
        return baseData;
    }
    const parsed = JSON.parse(raw);
    return parsed;
}
async function writeDanyao(userId, data) {
    const redis = getIoRedis();
    await redis.set(keys.danyao(userId), JSON.stringify(data));
}
var danyao = { readDanyao, writeDanyao, readAll };

export { danyao as default, readAll, readDanyao, writeDanyao };
