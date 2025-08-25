import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './keys.js';
import type { JSONData, FilePathType } from '../types/model';
import { filePathMap } from './settions.js';

/**
 * @param key
 * @returns
 */
export const getDataJSONParseByKey = async(key: string) => {
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
  } catch (error) {
    logger.warn(error);

    return null;
  }
  if (!data) {
    return null;
  }

  return data;
};

/**
 *
 * @param key
 * @returns
 */
export const getDataByKey = async(key: string) => {
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

/**
 * @param key
 * @param data
 */
export const setDataJSONStringifyByKey = async(key: string, data: unknown) => {
  const redis = getIoRedis();

  try {
    await redis.set(key, JSON.stringify(data));

    return true;
  } catch (error) {
    logger.warn(error);

    return false;
  }
};

/**
 * @param key
 * @returns
 */
export const existDataByKey = async(key: string) => {
  const redis = getIoRedis();
  const exists = await redis.exists(key);

  return exists === 1;
};

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const existDataByPath = (key: keyof typeof __PATH, from: string, name: string) => {
  const dir = `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`;

  return existDataByKey(dir);
};

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const readDataByPath = async(key: keyof typeof __PATH, from: string, name: string) => {
  return await getDataJSONParseByKey(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`);
};

/**
 *
 * @param key
 * @param from
 * @param name
 * @param data
 */
export const writeDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string,
  data: JSONData
): void => {
  setDataJSONStringifyByKey(
    `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`,
    data
  );
};

/**
 * 获取文件数据(user_qq为空查询item下的file_name文件)
 * @param file_name  [player,equipment,najie]
 * @param user_qq
 * @deprecated
 */
async function getData(file_name: FilePathType | string, user_qq?: string) {
  if (user_qq) {
    return await getDataJSONParseByKey(`${filePathMap[file_name]}:${user_qq}`);
  } else {
    return await getDataJSONParseByKey(`${filePathMap[file_name]}`);
  }
}

/**
 * 写入数据
 * @param file_name [player,equipment,najie]
 * @param user_qq
 * @param data
 * @deprecated
 */
function setData(file_name: FilePathType | string, user_qq: string | null, data: JSONData): void {
  setDataJSONStringifyByKey(`${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`, data);
}
export default {
  getData,
  setData
};
