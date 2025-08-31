import { keysAction, __PATH_CONFIG } from './keys.js';
import { getIoRedis } from '@alemonjs/db';
import { getConfigValue } from 'alemonjs';

const hasConfig = async (name) => {
    const redis = getIoRedis();
    const exists = await redis.exists(keysAction.config(name));
    return exists > 0;
};
const setConfig = async (name, data) => {
    try {
        const redis = getIoRedis();
        await redis.set(keysAction.config(name), JSON.stringify(data));
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
function deepMerge(target, source) {
    if (Array.isArray(source)) {
        return source;
    }
    if (Array.isArray(target) && !Array.isArray(source)) {
        return source;
    }
    if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] !== undefined) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = deepMerge(result[key] || {}, source[key]);
                }
                else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }
    return source;
}
async function getConfig(_app, name) {
    const redis = getIoRedis();
    const defaultData = __PATH_CONFIG[name];
    const curData = await redis.get(keysAction.config(name));
    if (curData) {
        try {
            const dbData = JSON.parse(curData);
            const mergedData = deepMerge(defaultData, dbData);
            return mergedData;
        }
        catch (error) {
            logger.error(`解析配置 ${name} 失败:`, error);
            await setConfig(name, defaultData);
            return defaultData;
        }
    }
    else {
        await setConfig(name, defaultData);
        return defaultData;
    }
}
const getAppCofig = () => {
    const values = getConfigValue() || {};
    const value = values['alemonjs-xiuxian'] || {};
    return value;
};
var config = {
    getConfig
};
function getAuctionKeys(botId) {
    const actualBotId = botId ?? getAppCofig()?.botId ?? 'default';
    return {
        AUCTION_OFFICIAL_TASK: keysAction.system('auctionofficialtask', actualBotId),
        AUCTION_GROUP_LIST: keysAction.system('auctionofficialtask_grouplist', actualBotId)
    };
}
const closeAuctionKeys = () => {
    const auctionKeys = getAuctionKeys();
    const redis = getIoRedis();
    void redis.del(auctionKeys.AUCTION_OFFICIAL_TASK);
    void redis.del(auctionKeys.AUCTION_GROUP_LIST);
};

export { closeAuctionKeys, config as default, getAppCofig, getAuctionKeys, getConfig, hasConfig, setConfig };
