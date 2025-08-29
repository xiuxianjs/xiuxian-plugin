/* 交易/拍卖相关函数抽离 */
import { getIoRedis } from '@alemonjs/db';
import type { AuctionItem } from '../types/data_extra';
import type { ExchangeRecord, ForumRecord } from '../types/model';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
import { getAuctionKeyManager } from './auction.js';
import { keys } from './keys.js';

export async function writeExchange(wupin: ExchangeRecord[]): Promise<void> {
  await setDataJSONStringifyByKey(keys.exchange('Exchange'), wupin);
}
export async function writeForum(wupin: ForumRecord[]): Promise<void> {
  await setDataJSONStringifyByKey(keys.exchange('Forum'), wupin);
}
export async function readExchange(): Promise<ExchangeRecord[]> {
  const Exchange = await getDataJSONParseByKey(keys.exchange('Exchange'));

  if (Array.isArray(Exchange)) {
    return Exchange;
  }

  // 如果不是数组，返回空数组
  return [];
}
export async function readForum(): Promise<ForumRecord[]> {
  const Forum = await getDataJSONParseByKey(keys.exchange('Forum'));

  if (Array.isArray(Forum)) {
    return Forum;
  }

  // 如果不是数组，返回空数组
  return [];
}
/**
 * 开启星阁拍卖
 * @returns 拍卖记录
 */
export async function openAU(): Promise<ExchangeRecord> {
  // 获取星阁key管理器，支持多机器人部署和自动数据迁移
  const auctionKeyManager = getAuctionKeyManager();

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
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
  const groupList = await redis.smembers(groupListKey);
  const wupin: ExchangeRecord = {
    thing: thingData,
    start_price: thingValue,
    last_price: thingValue,
    amount: thingAmount,
    last_offer_price: nowTime,
    last_offer_player: 0,
    groupList
  };

  const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();

  await setDataJSONStringifyByKey(auctionTaskKey, wupin);

  return wupin;
}

export default { writeExchange, writeForum, readExchange, readForum, openAU };
