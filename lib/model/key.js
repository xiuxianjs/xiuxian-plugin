import { baseKey } from './settions.js';

const getRedisKey = (user_id, action) => {
    return baseKey + ':' + user_id + ':' + action;
};

export { getRedisKey };
