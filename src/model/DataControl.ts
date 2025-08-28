import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './keys.js';

/**
 * @param key
 * @returns
 */
export const getDataJSONParseByKey = async <T>(key: string): Promise<T | null> => {
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
export const getDataByKey = async (key: string) => {
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

export const setDataByKey = async (key: string, data: string) => {
  const redis = getIoRedis();

  try {
    await redis.set(key, data);

    return true;
  } catch (error) {
    logger.warn(error);

    return false;
  }
};

export const delDataByKey = async (key: string) => {
  const redis = getIoRedis();

  try {
    await redis.del(key);

    return true;
  } catch (error) {
    logger.warn(error);

    return false;
  }
};

/**
 * @param key
 * @param data
 */
export const setDataJSONStringifyByKey = async <T>(key: string, data: T) => {
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
export const existDataByKey = async (key: string) => {
  const redis = getIoRedis();
  const exists = await redis.exists(key);

  return exists === 1;
};
