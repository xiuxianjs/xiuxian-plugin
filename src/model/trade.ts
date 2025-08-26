/* 交易/拍卖相关函数抽离 */
import { getIoRedis } from '@alemonjs/db';
import { safeParse } from './utils/safe.js';
import type { AuctionItem } from '../types/data_extra';
import type { ExchangeRecord, ForumRecord } from '../types/model';
import { keys } from './keys.js';
import { KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK } from './constants.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

export async function writeExchange(wupin: ExchangeRecord[]): Promise<void> {
  await setDataJSONStringifyByKey(keys.exchange('Exchange'), wupin);
}
export async function writeForum(wupin: ForumRecord[]): Promise<void> {
  await setDataJSONStringifyByKey(keys.exchange('Forum'), wupin);
}
export async function readExchange(): Promise<ExchangeRecord[]> {
  const Exchange = await getDataJSONParseByKey(keys.exchange('Exchange'));

  if (!Exchange) {
    return [];
  }
  // 如果Exchange是数组，直接返回
  if (Array.isArray(Exchange)) {
    return Exchange;
  }

  return safeParse<ExchangeRecord[]>(Exchange, []);
}
export async function readForum(): Promise<ForumRecord[]> {
  const Forum = await getDataJSONParseByKey(keys.exchange('Forum'));

  if (!Forum) {
    return [];
  }

  return safeParse<ForumRecord[]>(Forum, []);
}
export async function openAU(): Promise<ExchangeRecord> {
  const redisGlKey = KEY_AUCTION_GROUP_LIST;
  const data = {
    xingge: await getDataList('Xingge')
  };
  const xinggeFirst = data.xingge?.[0];
  const oneList = (xinggeFirst?.one || []) as AuctionItem[];

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
  const wupin: ExchangeRecord = {
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

export default { writeExchange, writeForum, readExchange, readForum, openAU };
