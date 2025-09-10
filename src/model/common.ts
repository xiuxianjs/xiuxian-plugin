import { useSend, Text } from 'alemonjs';
import { convert2integer } from './utils/number.js';
import { getIoRedis } from '@alemonjs/db';
import { getRedisKey, keys, keysAction } from './keys.js';
import { existDataByKey, getDataJSONParseByKey } from './DataControl.js';
import dayjs from 'dayjs';
import { ActionRecord } from '@src/types/action.js';
import { formatRemaining } from './actionHelper.js';

export function getRandomFromARR<T>(arr: T[]): T {
  const randIndex = Math.trunc(Math.random() * arr.length);

  return arr[randIndex];
}

export const BaseAction = {
  action: '空闲'
};

export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function timestampToTime(timestamp: number) {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

export function shijianc(time: number) {
  const date = new Date(time);

  return {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
}

interface LastSignStruct {
  time: number;
  sign: number;
}

export async function getLastSign(usrId: string): Promise<LastSignStruct | null> {
  try {
    const redis = getIoRedis();
    const time = await redis.get(getRedisKey(usrId, 'lastsign_time'));

    if (time) {
      if (time.startsWith('{')) {
        const data: LastSignStruct = JSON.parse(time);

        return data;
      } else {
        const data: LastSignStruct = {
          time: parseInt(time),
          sign: 1
        };

        await redis.set(getRedisKey(usrId, 'lastsign_time'), JSON.stringify(data));

        return data;
      }
    }

    return null;
  } catch (e) {
    logger.error(e);

    return null;
  }
}

export async function getPlayerAction(usrId: string): Promise<ActionRecord> {
  const raw: ActionRecord | null = await getDataJSONParseByKey(getRedisKey(usrId, 'action'));

  if (raw) {
    return { ...BaseAction, ...raw };
  }

  return BaseAction;
}

export function notUndAndNull<T>(obj: T | null | undefined): obj is T {
  return !isUndAndNull(obj);
}

export function isUndAndNull<T>(obj: T | null | undefined): obj is T {
  return obj === null || obj === undefined;
}

/**
 * todo
 * @param e
 * @returns
 */
export async function Go(e): Promise<boolean | 0> {
  const userId = e.UserId;
  const Send = useSend(e);
  const ext = await existDataByKey(keys.player(userId));

  if (!ext) {
    return 0;
  }
  const redis = getIoRedis();
  const gameAction = await redis.get(keysAction.gameAction(userId));

  if (gameAction && +gameAction === 1) {
    void Send(Text('修仙：游戏进行中...'));

    return 0;
  }

  const action = await getDataJSONParseByKey(keysAction.action(userId));

  if (!action) {
    return true;
  }

  if (!action && action?.action === '空闲') {
    return true;
  }

  const actionEndTime = action?.end_time ?? 0;
  const nowTime = Date.now();

  if (nowTime <= actionEndTime) {
    const timeTuple = formatRemaining(actionEndTime - nowTime);

    void Send(Text('正在' + action.action + '中,剩余时间:' + timeTuple));

    return 0;
  }

  return true;
}

export { convert2integer }; // 供按需具名导入使用

export default {
  getRandomFromARR,
  sleep,
  timestampToTime,
  shijianc,
  getLastsign: getLastSign,
  getPlayerAction,
  notUndAndNull,
  Go,
  convert2integer
};

/**
 * 获取推送信息
 * @param action 动作状态
 * @param playerId 玩家ID
 * @returns 推送信息
 */
export const getPushInfo = (
  action: {
    group_id?: string | number;
  },
  playerId: string
): { pushAddress: string; isGroup: boolean } => {
  let pushAddress = playerId;
  let isGroup = false;

  if (notUndAndNull(action.group_id)) {
    isGroup = true;
    pushAddress = String(action.group_id);
  }

  return { pushAddress, isGroup };
};
