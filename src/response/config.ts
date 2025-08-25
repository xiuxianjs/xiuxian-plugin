import { baseKey } from '@src/model/constants';
import dayjs from 'dayjs';

// 回复次数缓存（内存，防止频繁提醒）
export const replyCount: Record<string, number> = {};

// 验证码尝试次数缓存（内存，防止暴力尝试）
export const captchaTries: Record<string, number> = {};

export const MAX_CAPTCHA_TRIES = 6; // 最大验证码尝试次数
export const MIN_COUNT = 90; // 夜间阈值
export const MAX_COUNT = 120; // 白天阈值

// 判断是否为夜晚（23:00~06:59）
export function isNight (hour: number) {
  return hour >= 23 || hour < 7;
}

// 操作计数 Redis key
export const op = (userId: string) => `${baseKey}:op:${userId}:${dayjs().format('YYYYMMDDHH')}`;
