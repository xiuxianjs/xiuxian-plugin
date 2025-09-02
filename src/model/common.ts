import { useSend, Text } from 'alemonjs';
import { safeParse } from './utils/safe.js';
import type { LastSignTime } from '../types/model.js';
import { convert2integer } from './utils/number.js';
import { getIoRedis } from '@alemonjs/db';
import { getRedisKey, keys, keysAction } from './keys.js';
import { existDataByKey } from './DataControl.js';
import dayjs from 'dayjs';
import { ActionRecord } from '@src/types/action.js';

export function getRandomFromARR<T>(arr: T[]): T {
  const randIndex = Math.trunc(Math.random() * arr.length);

  return arr[randIndex];
}

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

export async function getLastsign(usrId: string): Promise<LastSignTime | false> {
  const redis = getIoRedis();
  const time = await redis.get(getRedisKey(usrId, 'lastsign_time'));

  if (time !== null) {
    return shijianc(parseInt(time));
  }

  return false;
}

export async function getPlayerAction(usrId: string): Promise<ActionRecord> {
  const redis = getIoRedis();
  const raw = await redis.get(getRedisKey(usrId, 'action'));
  const parsed: ActionRecord | null = safeParse(raw, null);

  return parsed;
}

export function notUndAndNull<T>(obj: T | null | undefined): obj is T {
  return !(obj === null || obj === undefined);
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
  const game_action = await redis.get(keysAction.gameAction(userId));

  if (game_action === '1') {
    void Send(Text('修仙：游戏进行中...'));

    return 0;
  }
  const actionRaw = await redis.get(getRedisKey(userId, 'action'));
  const action = safeParse(actionRaw, null);

  if (action) {
    const action_end_time = action.end_time ?? 0;
    const now_time = Date.now();

    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60);
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);

      void Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));

      return 0;
    }
  }

  return true;
}

export { convert2integer }; // 供按需具名导入使用

export default {
  getRandomFromARR,
  sleep,
  timestampToTime,
  shijianc,
  getLastsign,
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
