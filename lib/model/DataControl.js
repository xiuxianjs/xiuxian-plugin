import { getIoRedis } from '@alemonjs/db';

const getDataJSONParseByKey = async (key) => {
    const redis = getIoRedis();
    const ext = await redis.exists(key);
    if (!ext) {
        return null;
    }
    const res = await redis.get(key);
    if (!res) {
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

export { existDataByKey, getDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey };
