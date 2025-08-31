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
export const hasConfig = async (name: ConfigKey) => {
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
export const setConfig = async (name: ConfigKey, data) => {
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
 * 深度合并两个对象，支持嵌套结构
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * 获取配置，自动补充缺失的配置项
 * @param _app 应用名称（兼容性参数）
 * @param name 配置名称
 * @returns 完整的配置对象
 */
export async function getConfig<T extends ConfigKey>(_app: string, name: T): Promise<Data[T]> {
  const redis = getIoRedis();
  const defaultData = __PATH_CONFIG[name];
  const curData = await redis.get(keysAction.config(name));

  if (curData) {
    try {
      const dbData = JSON.parse(curData);

      // 深度合并本地默认配置和Redis中的配置
      const mergedData = deepMerge(defaultData, dbData);

      return mergedData;
    } catch (error) {
      logger.error(`解析配置 ${name} 失败:`, error);
      // 如果解析失败，返回默认配置并尝试保存
      await setConfig(name, defaultData);

      return defaultData;
    }
  } else {
    // Redis中没有配置，保存默认配置并返回
    await setConfig(name, defaultData);

    return defaultData;
  }
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

/**
 * 兼容性函数：获取带botId的星阁相关key（已废弃，建议使用AuctionKeyManager）
 * @deprecated 请使用 getAuctionKeyManager() 替代
 */
export function getAuctionKeys(botId?: string) {
  const actualBotId = botId ?? getAppCofig()?.botId ?? 'default';

  return {
    AUCTION_OFFICIAL_TASK: keysAction.system('auctionofficialtask', actualBotId),
    AUCTION_GROUP_LIST: keysAction.system('auctionofficialtask_grouplist', actualBotId)
  };
}

export const closeAuctionKeys = () => {
  const auctionKeys = getAuctionKeys();
  const redis = getIoRedis();

  void redis.del(auctionKeys.AUCTION_OFFICIAL_TASK);
  void redis.del(auctionKeys.AUCTION_GROUP_LIST);
};
