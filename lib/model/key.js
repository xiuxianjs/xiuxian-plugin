import { baseKey } from './settions.js';

const getRedisKey = (user_id, action) => {
    return baseKey + ':' + user_id + ':' + action;
};
const getRedisConfigKey = (name) => {
    return baseKey + ':config:' + name;
};

export { getRedisConfigKey, getRedisKey };
