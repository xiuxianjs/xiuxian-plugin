import { getIoRedis } from '@alemonjs/db';

const baseKey = 'xiuxian@1.3.0';
const getDataByUserId = async (user_id, action) => {
    const redis = getIoRedis();
    return await redis.get(baseKey + ':' + user_id + ':' + action);
};
const setDataByUserId = async (user_id, action, value) => {
    const redis = getIoRedis();
    return await redis.set(baseKey + ':' + user_id + ':' + action, value);
};

export { getDataByUserId, setDataByUserId };
