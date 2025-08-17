import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';

const initData = {
    id: '',
    currency: 0,
    big_month_card_days: 0,
    small_month_card_days: 0,
    currency_index: []
};
const initRechargeRecord = {
    id: '',
    user_id: '',
    type: '',
    value: 0,
    created_at: 0
};
const getCurrentRechargeRecordIndex = async () => {
    try {
        const redis = getIoRedis();
        const data = await redis.get(keys.currencyIndex());
        return data ? JSON.parse(data).length : 1;
    }
    catch (error) {
        logger.warn('Error getting current recharge record index:', error);
        return -1;
    }
};
const getNextRechargeRecordIndex = async () => {
    const redis = getIoRedis();
    const currentIndex = await getCurrentRechargeRecordIndex();
    await redis.set(keys.currencyIndex(), currentIndex + 1);
    return currentIndex + 1;
};
const findUserRechargeInfo = async (userId) => {
    try {
        const redis = getIoRedis();
        const data = await redis.get(keys.playerCurrency(userId));
        const rechargeInfo = data ? JSON.parse(data) : initData;
        return {
            ...initData,
            ...rechargeInfo,
            id: userId
        };
    }
    catch (error) {
        logger.warn('Error finding user recharge info:', error);
        return {
            ...initData,
            id: userId
        };
    }
};
const rechargeUserCurrency = async (userId, amount) => {
    try {
        const redis = getIoRedis();
        const data = await redis.get(keys.playerCurrency(userId));
        const userInfo = data ? JSON.parse(data) : initData;
        userInfo.currency += amount;
        await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo));
        return {
            ...initData,
            ...userInfo,
            id: userId
        };
    }
    catch (error) {
        logger.warn('Error recharging user currency:', error);
        return {
            ...initData,
            id: userId
        };
    }
};
const rechargeUserSmallMonthCard = async (userId, days = 30) => {
    try {
        const redis = getIoRedis();
        const data = await redis.get(keys.playerCurrency(userId));
        const userInfo = data ? JSON.parse(data) : initData;
        userInfo.small_month_card_days += days;
        const index = await getNextRechargeRecordIndex();
        if (index < 1) {
            return;
        }
        await redis.set(keys.currencyLog(String(index)), JSON.stringify({
            ...initRechargeRecord,
            id: String(index),
            user_id: userId,
            type: 'small_month_card',
            value: days,
            created_at: Date.now()
        }));
        const cur = {
            ...initData,
            ...userInfo,
            id: userId
        };
        await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo));
        return cur;
    }
    catch (error) {
        logger.warn('Error recharging user small month card:', error);
        return {
            ...initData,
            id: userId
        };
    }
};
const rechargeUserBigMonthCard = async (userId, days = 30) => {
    try {
        const redis = getIoRedis();
        const data = await redis.get(keys.playerCurrency(userId));
        const userInfo = data ? JSON.parse(data) : initData;
        userInfo.big_month_card_days += days;
        await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo));
        return {
            ...initData,
            ...userInfo,
            id: userId
        };
    }
    catch (error) {
        logger.warn('Error recharging user big month card:', error);
        return {
            ...initData,
            id: userId
        };
    }
};

export { findUserRechargeInfo, getCurrentRechargeRecordIndex, rechargeUserBigMonthCard, rechargeUserCurrency, rechargeUserSmallMonthCard };
