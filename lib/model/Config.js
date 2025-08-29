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
        console.log(`Setting config for ${name}:`, data);
        const redis = getIoRedis();
        await redis.set(keysAction.config(name), JSON.stringify(data));
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
async function getConfig(_app, name) {
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
