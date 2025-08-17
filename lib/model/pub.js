import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';

async function writeIt(custom) {
    const new_ARR = JSON.stringify(custom, null, '\t');
    const redis = getIoRedis();
    redis.set(keys.custom('custom'), new_ARR);
}
async function writePlayer(usr_qq, player) {
    const redis = getIoRedis();
    redis.set(keys.player(usr_qq), JSON.stringify(player));
    return;
}

export { writeIt, writePlayer };
