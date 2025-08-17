import { baseKey } from './constants.js';

const getRedisKey = (user_id, action) => {
    return baseKey + ':' + user_id + ':' + action;
};
const getRedisConfigKey = (name) => {
    return baseKey + ':config:' + name;
};
const getRedisSystemKey = (name) => {
    return baseKey + ':system:' + name;
};

export { getRedisConfigKey, getRedisKey, getRedisSystemKey };
