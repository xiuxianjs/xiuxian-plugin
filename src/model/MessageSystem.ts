import { getIoRedis } from '@alemonjs/db';
import { getAppCofig, keysAction } from '@src/model';
import dayjs from 'dayjs';

export interface IMessage {
  id: string;
  cid: string;
  uid: string;
  data: any;
}

/**
 * 生成唯一的消息id（毫秒*1000+0~999，防并发同毫秒冲突）
 */
const createMessageId = () => {
  const now = dayjs().valueOf(); // 毫秒
  const rand = Math.floor(Math.random() * 1000); // 0-999

  return String(now * 1000 + rand);
};

/**
 *
 * @param botId
 * @returns
 */
export const getIdsByBotId = async () => {
  const redis = getIoRedis();

  const value = getAppCofig();
  const botId = value?.botId ?? 'xiuxian';

  // 读取推送对象的key都带 botId
  const cidsArr = await redis.smembers(keysAction.system('cids', botId));
  const uidsArr = await redis.smembers(keysAction.system('uids', botId));
  const midArr = await redis.smembers(keysAction.system('mid', botId));

  const cidsSet = new Set(cidsArr);
  const uidsSet = new Set(uidsArr);
  const tagSet = new Set(midArr);

  return {
    cids: cidsSet,
    uids: uidsSet,
    mids: tagSet
  };
};

// 设置cid或uid
export const setIds = async ({ cid, uid, mid }: { cid?: string; uid?: string; mid?: string }) => {
  const value = getAppCofig();
  const botId = value?.botId ?? 'xiuxian';
  const redis = getIoRedis();

  if (cid) {
    await redis.sadd(keysAction.system('cids', botId), cid);
  }
  if (uid) {
    await redis.sadd(keysAction.system('uids', botId), uid);
  }
  if (mid) {
    await redis.sadd(keysAction.system('mid', botId), mid);
  }
};

/**
 * 写入消息到 Redis 的 zset，score 为当前时间戳
 */
export async function setMessage(message: IMessage) {
  const redis = getIoRedis();
  const now = dayjs().valueOf(); // 毫秒时间戳
  const zsetKey = keysAction.system('message-zset', 'g');

  message.id = message?.id || createMessageId();

  await redis.zadd(zsetKey, now, JSON.stringify(message));
}

/**
 * 读取最近 N 分钟内的消息
 */
export async function getRecentMessages(minutes = 5): Promise<IMessage[]> {
  const redis = getIoRedis();
  const now = dayjs();
  const min = now.subtract(minutes, 'minute').valueOf();
  const zsetKey = keysAction.system('message-zset', 'g');
  const result = await redis.zrangebyscore(zsetKey, min, now.valueOf());

  return result.map(str => JSON.parse(str));
}

/**
 *
 */
export const clearOldMessages = async () => {
  const redis = getIoRedis();
  const now = dayjs();
  const zsetKey = keysAction.system('message-zset', 'g');

  // 清理历史消息，保留最近 30 分钟数据
  await redis.zremrangebyscore(zsetKey, 0, now.subtract(30, 'minute').valueOf());
};
