import { __PATH } from './paths.js';
import { getIoRedis } from '@alemonjs/db';
import data from './XiuxianData.js';
import { safeParse } from './utils/safe.js';

const redis = getIoRedis();
async function writeExchange(wupin) {
    await redis.set(`${__PATH.Exchange}:Exchange`, JSON.stringify(wupin));
}
async function writeForum(wupin) {
    await redis.set(`${__PATH.Exchange}:Forum`, JSON.stringify(wupin));
}
async function readExchange() {
    const Exchange = await redis.get(`${__PATH.Exchange}:Exchange`);
    if (!Exchange)
        return [];
    return safeParse(Exchange, []);
}
async function readForum() {
    const Forum = await redis.get(`${__PATH.Exchange}:Forum`);
    if (!Forum)
        return [];
    return safeParse(Forum, []);
}
async function openAU() {
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const xinggeFirst = data.xingge?.[0];
    const oneList = (xinggeFirst?.one || []);
    if (oneList.length === 0)
        throw new Error('星阁拍卖行数据为空');
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
    await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin));
    return wupin;
}
var trade = { writeExchange, writeForum, readExchange, readForum, openAU };

export { trade as default, openAU, readExchange, readForum, writeExchange, writeForum };
