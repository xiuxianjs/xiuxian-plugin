import { getIoRedis } from '@alemonjs/db';
import { safeParse } from './utils/safe.js';
import { keys } from './keys.js';
import { KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK } from './constants.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function writeExchange(wupin) {
    await setDataJSONStringifyByKey(keys.exchange('Exchange'), wupin);
}
async function writeForum(wupin) {
    await setDataJSONStringifyByKey(keys.exchange('Forum'), wupin);
}
async function readExchange() {
    const Exchange = await getDataJSONParseByKey(keys.exchange('Exchange'));
    if (!Exchange) {
        return [];
    }
    if (Array.isArray(Exchange)) {
        return Exchange;
    }
    return safeParse(Exchange, []);
}
async function readForum() {
    const Forum = await getDataJSONParseByKey(keys.exchange('Forum'));
    if (!Forum) {
        return [];
    }
    return safeParse(Forum, []);
}
async function openAU() {
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    const data = {
        xingge: await getDataList('Xingge')
    };
    const xinggeFirst = data.xingge?.[0];
    const oneList = (xinggeFirst?.one || []);
    if (oneList.length === 0) {
        throw new Error('星阁拍卖行数据为空');
    }
    const redis = getIoRedis();
    const random = Math.floor(Math.random() * oneList.length);
    const thingData = oneList[random];
    const thingValue = Math.floor(Number(thingData.出售价) || 0);
    const thingAmount = 1;
    const nowTime = Date.now();
    const groupList = await redis.smembers(redisGlKey);
    const wupin = {
        thing: thingData,
        start_price: thingValue,
        last_price: thingValue,
        amount: thingAmount,
        last_offer_price: nowTime,
        last_offer_player: 0,
        groupList
    };
    await setDataJSONStringifyByKey(KEY_AUCTION_OFFICIAL_TASK, wupin);
    return wupin;
}
var trade = { writeExchange, writeForum, readExchange, readForum, openAU };

export { trade as default, openAU, readExchange, readForum, writeExchange, writeForum };
