import { __PATH_CONFIG, keysAction } from './keys';
import { getIoRedis } from '@alemonjs/db';
import { getConfigValue } from 'alemonjs';

export type Data = typeof __PATH_CONFIG;

export type ConfigKey = keyof Data;

/**
 *
 * @param name
 * @returns
 */
export const hasConfig = async(name: ConfigKey) => {
  const redis = getIoRedis();
  const exists = await redis.exists(keysAction.config(name));

  return exists > 0;
};

/**
 *
 * @param name
 * @param data
 * @returns
 */
export const setConfig = async(name: ConfigKey, data) => {
  try {
    console.log(`Setting config for ${name}:`, data);
    const redis = getIoRedis();

    await redis.set(keysAction.config(name), JSON.stringify(data));

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 *
 * @param _app
 * @param name
 * @returns
 */
export async function getConfig<T extends ConfigKey>(_app: string, name: T): Promise<Data[T]> {
  const redis = getIoRedis();
  const data = __PATH_CONFIG[name];
  const curData = await redis.get(keysAction.config(name));

  if (curData) {
    const db = JSON.parse(curData);

    return {
      ...data,
      ...db
    };
  }

  return data;
}

/**
 *
 * @returns
 */
export const getAppCofig = () => {
  const values = getConfigValue() || {};
  const value = values['alemonjs-xiuxian'] || {};

  return value;
};

export default {
  getConfig
};
