import { __PATH } from './paths.js';
import { getIoRedis } from '@alemonjs/db';

async function writeIt(custom) {
    const new_ARR = JSON.stringify(custom, null, '\t');
    const redis = getIoRedis();
    redis.set(`${__PATH.custom}:custom`, new_ARR);
}
async function writePlayer(usr_qq, player) {
    const redis = getIoRedis();
    redis.set(`${__PATH.player_path}:${usr_qq}`, JSON.stringify(player));
    return;
}

export { writeIt, writePlayer };
