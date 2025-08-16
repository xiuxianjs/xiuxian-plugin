import YAML from 'yaml';
import { readFileSync } from 'fs';
import { __PATH_CONFIG } from './paths.js';
import { getIoRedis } from '@alemonjs/db';
import { getRedisConfigKey } from './key.js';

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
    const fileURL = __PATH_CONFIG[name];
    const data = YAML.parse(readFileSync(fileURL, 'utf8'));
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
var config = {
    getConfig
};

export { config as default, getConfig, hasConfig, setConfig };
