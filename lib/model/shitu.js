import { getIoRedis } from '@alemonjs/db';
import { safeParse } from './utils/safe.js';
import { keys } from './keys.js';

async function writeShitu(list) {
    const redis = getIoRedis();
    await redis.set(keys.shitu('shitu'), JSON.stringify(list));
}
async function readShitu() {
    const redis = getIoRedis();
    const shitu = await redis.get(keys.shitu('shitu'));
    if (!shitu)
        return [];
    return safeParse(shitu, []);
}
async function fstaddShitu(A) {
    let list = [];
    try {
        list = await readShitu();
    }
    catch {
        await writeShitu([]);
    }
    const rec = {
        师傅: A,
        收徒: 0,
        未出师徒弟: 0,
        任务阶段: 0,
        renwu1: 0,
        renwu2: 0,
        renwu3: 0,
        师徒BOOS剩余血量: 100000000,
        已出师徒弟: []
    };
    list.push(rec);
    await writeShitu(list);
}
async function addShitu(A, num) {
    let list = [];
    try {
        list = await readShitu();
    }
    catch {
        await writeShitu([]);
    }
    let i;
    for (i = 0; i < list.length; i++)
        if (list[i].A == A)
            break;
    if (i == list.length) {
        await fstaddShitu(A);
        list = await readShitu();
    }
    list[i].收徒 += num;
    await writeShitu(list);
}
async function findShitu(A) {
    let list = [];
    try {
        list = await readShitu();
    }
    catch {
        await writeShitu([]);
    }
    let i;
    for (i = 0; i < list.length; i++)
        if (list[i].师傅 == A)
            break;
    if (i == list.length)
        return false;
    return list[i].师徒 ?? false;
}
async function findTudi(A) {
    const list = await readShitu();
    const target = String(A);
    for (let i = 0; i < list.length; i++) {
        if (String(list[i].未出师徒弟) == target)
            return list[i].师徒 ?? false;
    }
    return false;
}
var shitu = {
    writeShitu,
    readShitu,
    fstaddShitu,
    addShitu,
    findShitu,
    findTudi
};

export { addShitu, shitu as default, findShitu, findTudi, fstaddShitu, readShitu, writeShitu };
