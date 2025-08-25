import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './keys.js';
import { filePathMap } from './settions.js';

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
const existDataByPath = (key, from, name) => {
    const dir = `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`;
    return existDataByKey(dir);
};
const readDataByPath = async (key, from, name) => {
    return await getDataJSONParseByKey(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`);
};
const writeDataByPath = (key, from, name, data) => {
    setDataJSONStringifyByKey(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`, data);
};
async function getData(file_name, user_qq) {
    if (user_qq) {
        return await getDataJSONParseByKey(`${filePathMap[file_name]}:${user_qq}`);
    }
    else {
        return await getDataJSONParseByKey(`${filePathMap[file_name]}`);
    }
}
function setData(file_name, user_qq, data) {
    setDataJSONStringifyByKey(`${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`, data);
}
var DataControl = {
    getData,
    setData
};

export { DataControl as default, existDataByKey, existDataByPath, getDataByKey, getDataJSONParseByKey, readDataByPath, setDataJSONStringifyByKey, writeDataByPath };
