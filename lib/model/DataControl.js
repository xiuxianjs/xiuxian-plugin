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
    const redis = getIoRedis();
    return redis.exists(dir);
};
const readDataByPath = async (key, from, name) => {
    const redis = getIoRedis();
    try {
        const data = await redis.get(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`);
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('读取文件错误：' + error);
        return null;
    }
};
const writeDataByPath = (key, from, name, data) => {
    const redis = getIoRedis();
    redis.set(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`, JSON.stringify(data));
};
async function existData(file_path_type, file_name) {
    const redis = getIoRedis();
    const res = await redis.exists(`${filePathMap[file_path_type]}:${file_name}`);
    return res === 1;
}
async function getData(file_name, user_qq) {
    const redis = getIoRedis();
    if (user_qq) {
        const data = await redis.get(`${filePathMap[file_name]}:${user_qq}`);
        return data ? JSON.parse(data) : null;
    }
    else {
        const data = await redis.get(`${filePathMap[file_name]}`);
        return data ? JSON.parse(data) : null;
    }
}
function setData(file_name, user_qq, data) {
    const redis = getIoRedis();
    redis.set(`${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`, JSON.stringify(data));
    return;
}
var DataControl = {
    existData,
    getData,
    setData
};

export { DataControl as default, existDataByKey, existDataByPath, getDataByKey, getDataJSONParseByKey, readDataByPath, setDataJSONStringifyByKey, writeDataByPath };
