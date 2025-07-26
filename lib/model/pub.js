import { __PATH } from './paths.js';
import { redis } from '../api/api.js';

async function writeIt(custom) {
    const new_ARR = JSON.stringify(custom, null, '\t');
    redis.set(`${__PATH.custom}:custom`, new_ARR);
    return;
}
async function writePlayer(usr_qq, player) {
    redis.set(`${__PATH.player_path}:${usr_qq}`, JSON.stringify(player));
    return;
}

export { writeIt, writePlayer };
