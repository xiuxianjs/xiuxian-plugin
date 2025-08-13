import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './paths.js';
import { readAll } from './duanzaofu.js';

const redis = getIoRedis();
async function readDanyao(userId) {
    const raw = await redis.get(`${__PATH.danyao_path}:${userId}`);
    if (!raw) {
        const data = {
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
        await writeDanyao(userId, data);
        return data;
    }
    const parsed = JSON.parse(raw);
    return parsed;
}
async function writeDanyao(userId, data) {
    await redis.set(`${__PATH.danyao_path}:${userId}`, JSON.stringify(data));
}
var danyao = { readDanyao, writeDanyao, readAll };

export { danyao as default, readAll, readDanyao, writeDanyao };
