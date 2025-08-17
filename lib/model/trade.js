import { getIoRedis } from '@alemonjs/db';
import { safeParse } from './utils/safe.js';
import { keys } from './keys.js';
import { KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK } from './constants.js';
import { getDataList } from './DataList.js';

async function writeExchange(wupin) {
    const redis = getIoRedis();
    await redis.set(keys.exchange('Exchange'), JSON.stringify(wupin));
}
async function writeForum(wupin) {
    const redis = getIoRedis();
    await redis.set(keys.exchange('Forum'), JSON.stringify(wupin));
}
async function readExchange() {
    const redis = getIoRedis();
    const Exchange = await redis.get(keys.exchange('Exchange'));
    if (!Exchange)
        return [];
    return safeParse(Exchange, []);
}
async function readForum() {
    const redis = getIoRedis();
    const Forum = await redis.get(keys.exchange('Forum'));
    if (!Forum)
        return [];
    return safeParse(Forum, []);
}
async function openAU() {
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    const data = {
        xingge: await getDataList('Xingge')
    };
    const xinggeFirst = data.xingge?.[0];
    const oneList = (xinggeFirst?.one || []);
    if (oneList.length === 0)
        throw new Error('星阁拍卖行数据为空');
    const redis = getIoRedis();
    const random = Math.floor(Math.random() * oneList.length);
    const thing_data = oneList[random];
    const thing_value = Math.floor(Number(thing_data.出售价) || 0);
    const thing_amount = 1;
    const now_time = Date.now();
    const groupList = await redis.smembers(redisGlKey);
    const wupin = {
        thing: thing_data,
        start_price: thing_value,
        last_price: thing_value,
        amount: thing_amount,
        last_offer_price: now_time,
        last_offer_player: 0,
        groupList
    };
    await redis.set(KEY_AUCTION_OFFICIAL_TASK, JSON.stringify(wupin));
    return wupin;
}
var trade = { writeExchange, writeForum, readExchange, readForum, openAU };

export { trade as default, openAU, readExchange, readForum, writeExchange, writeForum };
