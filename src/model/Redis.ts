import { getIoRedis } from '@alemonjs/db';
import type { ActionType } from '../types/model';
import { getRedisKey } from './keys';

/**
 * @param user_id
 * @param action
 * @returns
 */
export const getDataByUserId = async (userId: string, action: ActionType) => {
  const redis = getIoRedis();

  return await redis.get(getRedisKey(userId, action));
};

export const setDataByUserId = async <T extends string | number | boolean | object>(
  userId: string,
  action: ActionType,
  value: T
) => {
  const redis = getIoRedis();
  const isStringOrNumber = typeof value === 'string' || typeof value === 'number';
  const payload = isStringOrNumber ? String(value) : JSON.stringify(value);

  return await redis.set(getRedisKey(userId, action), payload);
};
