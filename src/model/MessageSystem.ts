import { getIoRedis } from '@alemonjs/db';
import { getAppConfig, keysAction } from '@src/model';
import { DataEnums, Mention } from 'alemonjs';
import dayjs from 'dayjs';

/**
 * 在局部中间件中，
 * 记录当前机器人所在的 uid 和 cid
 * 便利消息池，当发现是自己可发送的消息时。
 * 进行主动发送
 */

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

  const value = getAppConfig();
  const botId = value?.botId ?? 'xiuxian';

  // 读取推送对象的key都带 botId
  const cidsArr = await redis.smembers(keysAction.system('message:cids', botId));
  const uidsArr = await redis.smembers(keysAction.system('message:uids', botId));
  const midArr = await redis.smembers(keysAction.system('message:mid', botId));

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
  const value = getAppConfig();
  const botId = value?.botId ?? 'xiuxian';
  const redis = getIoRedis();

  if (cid) {
    await redis.sadd(keysAction.system('message:cids', botId), cid);
  }
  if (uid) {
    await redis.sadd(keysAction.system('message:uids', botId), uid);
  }
  if (mid) {
    await redis.sadd(keysAction.system('message:mid', botId), mid);
  }
};

/**
 * 写入消息到 Redis 的 zset，score 为当前时间戳
 */
export async function setMessage(message: IMessage) {
  const redis = getIoRedis();
  const now = dayjs().valueOf(); // 毫秒时间戳
  const zsetKey = keysAction.system('message:zset', 'g');

  message.id = message?.id || createMessageId();

  if (!message.id) {
    return;
  }
  // cid 和 uid都为空。则直接返回
  if (!message.cid && !message.uid) {
    return;
  }

  if (!message.data) {
    return;
  }

  await redis.zadd(zsetKey, now, JSON.stringify(message));
}

/**
 * 读取最近 N 分钟内的消息
 */
export async function getRecentMessages(minutes = 5): Promise<IMessage[]> {
  const redis = getIoRedis();
  const now = dayjs();
  const min = now.subtract(minutes, 'minute').valueOf();
  const zsetKey = keysAction.system('message:zset', 'g');
  const result = await redis.zrangebyscore(zsetKey, min, now.valueOf());

  return result.map(str => JSON.parse(str));
}

/**
 *
 */
export const clearOldMessages = async () => {
  const redis = getIoRedis();
  const now = dayjs();
  const zsetKey = keysAction.system('message:zset', 'g');

  // 清理历史消息，保留最近 30 分钟数据
  await redis.zremrangebyscore(zsetKey, 0, now.subtract(30, 'minute').valueOf());
};

export const getLastRunTime = async () => {
  const redis = getIoRedis();
  const value = getAppConfig();
  const botId = value?.botId ?? 'xiuxian';

  const lastRunKey = keysAction.system('message:lasttime', botId);
  const lastRunStr = await redis.get(lastRunKey);

  return lastRunStr ? dayjs(Number(lastRunStr)) : null;
};

export const setLastRunTime = async () => {
  const redis = getIoRedis();
  const value = getAppConfig();
  const botId = value?.botId ?? 'xiuxian';

  const lastRunKey = keysAction.system('message:lasttime', botId);

  const time = dayjs();

  await redis.set(lastRunKey, time.valueOf());
};

/**
 *
 * @param param0
 * @param data
 */
export const pushMessage = (
  {
    uid,
    cid
  }: {
    uid?: string;
    cid?: string;
  },
  data: DataEnums[]
) => {
  if (cid && uid) {
    // 群消息。而且还有 uid。需要@提及
    void setMessage({
      id: '',
      uid: uid ?? '',
      cid: cid ?? '',
      data: JSON.stringify(format(Mention(uid), ...data))
    });

    return;
  }

  void setMessage({
    id: '',
    uid: uid ?? '',
    cid: cid ?? '',
    data: JSON.stringify(format(...data))
  });
};
