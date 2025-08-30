import { getIoRedis } from '@alemonjs/db';

const getDataJSONParseByKey = async (key) => {
    const redis = getIoRedis();
    const ext = await redis.exists(key);
    if (!ext) {
        logger.warn(`数据不存在 ext: ${key}`);
        return null;
    }
    const res = await redis.get(key);
    if (!res) {
        logger.warn(`数据不存在 res: ${key}`);
        return null;
    }
    let data = null;
    try {
        data = JSON.parse(res);
    }
    catch (error) {
        logger.warn(error);
        return null;
    }
    if (!data) {
        logger.warn(`数据不存在 data: ${key}`);
        return null;
    }
    return data;
};
const getDataByKey = async (key) => {
    const redis = getIoRedis();
    const exists = await redis.exists(key);
    if (!exists) {
        return null;
    }
    const res = await redis.get(key);
    if (!res) {
        return null;
    }
    return res;
};
const setDataByKey = async (key, data) => {
    const redis = getIoRedis();
    try {
        await redis.set(key, data);
        return true;
    }
    catch (error) {
        logger.warn(error);
        return false;
    }
};
const delDataByKey = async (key) => {
    const redis = getIoRedis();
    try {
        await redis.del(key);
        return true;
    }
    catch (error) {
        logger.warn(error);
        return false;
    }
};
const setDataJSONStringifyByKey = async (key, data) => {
    const redis = getIoRedis();
    try {
        await redis.set(key, JSON.stringify(data));
        return true;
    }
    catch (error) {
        logger.warn(error);
        return false;
    }
};
const existDataByKey = async (key) => {
    const redis = getIoRedis();
    const exists = await redis.exists(key);
    return exists === 1;
};

export { delDataByKey, existDataByKey, getDataByKey, getDataJSONParseByKey, setDataByKey, setDataJSONStringifyByKey };
