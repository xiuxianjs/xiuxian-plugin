import { getIoRedis } from '@alemonjs/db';
import { getRedisKey } from './keys';
import { ActionType } from '@src/types/keys';

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
