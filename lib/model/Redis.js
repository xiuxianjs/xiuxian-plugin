import { getIoRedis } from '@alemonjs/db';
import { baseKey } from './settions.js';

const getDataByUserId = async (user_id, action) => {
    const redis = getIoRedis();
    return await redis.get(baseKey + ':' + user_id + ':' + action);
};
const setDataByUserId = async (user_id, action, value) => {
    const redis = getIoRedis();
    const payload = typeof value === 'string' || typeof value === 'number'
        ? String(value)
        : JSON.stringify(value);
    return await redis.set(baseKey + ':' + user_id + ':' + action, payload);
};

export { getDataByUserId, setDataByUserId };
