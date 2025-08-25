import { getIoRedis } from '@alemonjs/db';
import type { ActionType } from '../types/model';
import { getRedisKey } from './keys';

/**
 * @param user_id
 * @param action
 * @returns
 */
export const getDataByUserId = async (user_id: string, action: ActionType) => {
  const redis = getIoRedis();
  return await redis.get(getRedisKey(user_id, action));
};

export const setDataByUserId = async <T extends string | number | boolean | object>(
  user_id: string,
  action: ActionType,
  value: T
) => {
  const redis = getIoRedis();
  const payload =
    typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value);
  return await redis.set(getRedisKey(user_id, action), payload);
};
