import { getIoRedis } from '@alemonjs/db';
import { getDataList } from './DataList.js';
import { setDataJSONStringifyByKey, getDataJSONParseByKey } from './DataControl.js';
import { getAuctionKeyManager } from './auction.js';
import { keys } from './keys.js';

async function writeExchange(wupin) {
    await setDataJSONStringifyByKey(keys.exchange('Exchange'), wupin);
}
async function writeForum(wupin) {
    await setDataJSONStringifyByKey(keys.exchange('Forum'), wupin);
}
async function readExchange() {
    const Exchange = await getDataJSONParseByKey(keys.exchange('Exchange'));
    if (Array.isArray(Exchange)) {
        return Exchange;
    }
    return [];
}
async function readForum() {
    const Forum = await getDataJSONParseByKey(keys.exchange('Forum'));
    if (Array.isArray(Forum)) {
        return Forum;
    }
    return [];
}
async function openAU() {
    const auctionKeyManager = getAuctionKeyManager();
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
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await redis.smembers(groupListKey);
    const wupin = {
        thing: thingData,
        start_price: thingValue,
        lastPrice: thingValue,
        amount: thingAmount,
        last_offer_price: nowTime,
        last_offer_player: 0,
        groupList
    };
    const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
    await setDataJSONStringifyByKey(auctionTaskKey, wupin);
    return wupin;
}
var trade = { writeExchange, writeForum, readExchange, readForum, openAU };

export { trade as default, openAU, readExchange, readForum, writeExchange, writeForum };
