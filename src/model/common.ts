// 通用玩家状态与工具函数抽离
import { useSend, Text, EventsMessageCreateEnum } from 'alemonjs';
import { safeParse } from './utils/safe.js';
import type { LastSignTime, PlayerActionData } from '../types/model';
import { convert2integer } from './utils/number.js';
import { getIoRedis } from '@alemonjs/db';
import { getRedisKey, keys, keysAction } from './keys.js';
import { existDataByKey } from './DataControl.js';

export function getRandomFromARR<T>(arr: T[]): T {
  const randIndex = Math.trunc(Math.random() * arr.length);

  return arr[randIndex];
}

export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function timestampToTime(timestamp: number) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();

  return Y + M + D + h + m + s;
}

export async function shijianc(time: number) {
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

export async function getLastsign(usr_qq: string): Promise<LastSignTime | false> {
  const redis = getIoRedis();
  const time = await redis.get(getRedisKey(usr_qq, 'lastsign_time'));

  if (time != null) { return await shijianc(parseInt(time)); }

  return false;
}

export async function getPlayerAction(usr_qq: string): Promise<PlayerActionData> {
  const redis = getIoRedis();
  const raw = await redis.get(getRedisKey(usr_qq, 'action'));
  const parsed = safeParse(raw, null) as Partial<PlayerActionData> | null;

  if (parsed) {
    return {
      action: String(parsed.action),
      time: parsed.time,
      end_time: parsed.end_time,
      plant: parsed.plant,
      mine: parsed.mine,
      is_jiesuan: parsed.is_jiesuan ?? 0
    };
  }

  return { action: '空闲' };
}

export async function dataverification(e: EventsMessageCreateEnum) {
  if (e.name !== 'message.create') { return 1; }
  const usr_qq = e.UserId;
  const ext = await existDataByKey(keys.player(usr_qq));

  if (!ext) { return 1; }

  return 0;
}

export function notUndAndNull<T>(obj: T | null | undefined): obj is T {
  return !(obj == null);
}

export function isNotBlank(value): boolean {
  return !(value === null || value === undefined || value === '');
}
/**
 * todo
 * @param e
 * @returns
 */
export async function Go(e): Promise<boolean | 0> {
  const usr_qq = e.UserId;
  const Send = useSend(e);
  const ext = await existDataByKey(keys.player(usr_qq));

  if (!ext) {
    return 0;
  }
  const redis = getIoRedis();
  const game_action = await redis.get(keysAction.gameAction(usr_qq));

  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'));

    return 0;
  }
  const actionRaw = await redis.get(getRedisKey(usr_qq, 'action'));
  const action = safeParse(actionRaw, null) as PlayerActionData | null;

  if (action) {
    const action_end_time = action.end_time ?? 0;
    const now_time = Date.now();

    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60);
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);

      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));

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
  dataverification,
  notUndAndNull,
  isNotBlank,
  Go,
  convert2integer
};
