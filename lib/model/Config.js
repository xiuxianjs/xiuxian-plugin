import { getRedisConfigKey, __PATH_CONFIG } from './keys.js';
import { getIoRedis } from '@alemonjs/db';
import { getConfigValue } from 'alemonjs';

const hasConfig = async (name) => {
    const redis = getIoRedis();
    const key = getRedisConfigKey(name);
    const e = await redis.exists(key);
    return e > 0;
};
const setConfig = async (name, data) => {
    try {
        const redis = getIoRedis();
        const key = getRedisConfigKey(name);
        await redis.set(key, JSON.stringify(data));
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
async function getConfig(_app, name) {
    const redis = getIoRedis();
    const key = getRedisConfigKey(name);
    const data = __PATH_CONFIG[name];
    const curData = await redis.get(key);
    if (curData) {
        const db = JSON.parse(curData);
        return {
            ...data,
            ...db
        };
    }
    return data;
}
const getAppCofig = () => {
    const values = getConfigValue() || {};
    const value = values['alemonjs-xiuxian'] || {};
    return value;
};
var config = {
    getConfig
};

export { config as default, getAppCofig, getConfig, hasConfig, setConfig };
