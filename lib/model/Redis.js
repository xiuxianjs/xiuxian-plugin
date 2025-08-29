import { getIoRedis } from '@alemonjs/db';
import { getRedisKey } from './keys.js';

const setDataByUserId = async (userId, action, value) => {
    const redis = getIoRedis();
    const isStringOrNumber = typeof value === 'string' || typeof value === 'number';
    const payload = isStringOrNumber ? String(value) : JSON.stringify(value);
    return await redis.set(getRedisKey(userId, action), payload);
};

export { setDataByUserId };
