import { getIoRedis } from '@alemonjs/db';

const CURRENCY_CONFIG = {
    RMB_TO_CURRENCY_RATE: 10,
    FIRST_RECHARGE_BONUS_RATE: 0.5,
    TRANSACTION_EXPIRE_TIME: 86400,
    DEFAULT_PAGE_LIMIT: 100
};
const RECHARGE_TIERS = {
    TIER_1: { amount: 6, name: '6元档' },
    TIER_2: { amount: 30, name: '30元档' },
    TIER_3: { amount: 98, name: '98元档' },
    TIER_4: { amount: 128, name: '128元档' },
    TIER_5: { amount: 328, name: '328元档' },
    TIER_6: { amount: 628, name: '628元档' }
};
const MONTH_CARD_CONFIG = {
    SMALL: { price: 28, days: 30, name: '小月卡' },
    BIG: { price: 58, days: 30, name: '大月卡' }
};
const REDIS_KEYS = {
    PLAYER_CURRENCY: (userId) => `data:alemonjs-xiuxian:player_currency:${userId}`,
    CURRENCY_LOG: (recordId) => `data:alemonjs-xiuxian:currency_log:${recordId}`,
    CURRENCY_INDEX: () => 'data:alemonjs-xiuxian:currency_index',
    TRANSACTION: (transactionId) => `data:alemonjs-xiuxian:transaction:${transactionId}`,
    GLOBAL_STATS: () => 'data:alemonjs-xiuxian:global_recharge_stats',
    PLAYER_CURRENCY_PATTERN: () => 'data:alemonjs-xiuxian:player_currency:*'
};
var RechargeType;
(function (RechargeType) {
    RechargeType["CURRENCY"] = "currency";
    RechargeType["SMALL_MONTH_CARD"] = "small_month_card";
    RechargeType["BIG_MONTH_CARD"] = "big_month_card";
    RechargeType["COMBO"] = "combo";
})(RechargeType || (RechargeType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESS"] = "success";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (PaymentStatus = {}));
const getAmountByTier = (tier) => {
    if (tier === MONTH_CARD_CONFIG.SMALL.name) {
        return MONTH_CARD_CONFIG.SMALL.price;
    }
    if (tier === MONTH_CARD_CONFIG.BIG.name) {
        return MONTH_CARD_CONFIG.BIG.price;
    }
    for (const tierConfig of Object.values(RECHARGE_TIERS)) {
        if (tierConfig.name === tier) {
            return tierConfig.amount;
        }
    }
    throw new Error(`Unknown tier: ${tier}`);
};
const calculateCurrencyGained = (amount) => {
    return Math.floor(amount * CURRENCY_CONFIG.RMB_TO_CURRENCY_RATE);
};
const calculateFirstRechargeBonus = (amount) => {
    return Math.floor(amount * CURRENCY_CONFIG.FIRST_RECHARGE_BONUS_RATE);
};
const initUserCurrencyData = {
    id: '',
    currency: 0,
    big_month_card_days: 0,
    small_month_card_days: 0,
    is_first_recharge: true,
    first_recharge_time: 0,
    total_recharge_amount: 0,
    total_recharge_count: 0,
    last_recharge_time: 0,
    recharge_record_ids: [],
    created_at: 0,
    updated_at: 0
};
const initRechargeRecord = {
    id: '',
    user_id: '',
    type: RechargeType.CURRENCY,
    tier: '',
    currency_gained: 0,
    month_card_days: 0,
    month_card_type: '',
    payment_status: PaymentStatus.PENDING,
    payment_method: '',
    transaction_id: '',
    created_at: 0,
    paid_at: 0,
    remark: '',
    ip_address: '',
    device_info: '',
    is_first_recharge: false,
    first_recharge_bonus: 0
};
const initGlobalRechargeStats = {
    total_amount: 0,
    total_count: 0,
    today_amount: 0,
    today_count: 0,
    month_amount: 0,
    month_count: 0,
    first_recharge_users: 0,
    updated_at: 0
};
const getNextRechargeRecordId = async () => {
    try {
        const redis = getIoRedis();
        const nextId = await redis.incr(REDIS_KEYS.CURRENCY_INDEX());
        return nextId.toString();
    }
    catch (error) {
        logger.warn('Error getting next recharge record ID:', error);
        return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
};
const findUserRechargeInfo = async (userId) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
    }
    try {
        const redis = getIoRedis();
        const data = await redis.get(REDIS_KEYS.PLAYER_CURRENCY(userId));
        const userInfo = data ? JSON.parse(data) : initUserCurrencyData;
        return {
            ...initUserCurrencyData,
            ...userInfo,
            id: userId
        };
    }
    catch (error) {
        logger.warn('Error finding user recharge info:', error);
        return {
            ...initUserCurrencyData,
            id: userId
        };
    }
};
const createRechargeRecord = async (userId, rechargeData) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
    }
    if (!rechargeData.tier || typeof rechargeData.tier !== 'string') {
        throw new Error('Invalid tier');
    }
    if (!Object.values(RechargeType).includes(rechargeData.type)) {
        throw new Error('Invalid recharge type');
    }
    try {
        const redis = getIoRedis();
        const recordId = await getNextRechargeRecordId();
        const userInfo = await findUserRechargeInfo(userId);
        const isFirstRecharge = userInfo.is_first_recharge;
        const amount = getAmountByTier(rechargeData.tier);
        const record = {
            ...initRechargeRecord,
            id: recordId,
            user_id: userId,
            type: rechargeData.type,
            tier: rechargeData.tier,
            currency_gained: rechargeData.currency_gained ?? 0,
            month_card_days: rechargeData.month_card_days ?? 0,
            month_card_type: rechargeData.month_card_type ?? '',
            payment_method: rechargeData.payment_method ?? '',
            ip_address: rechargeData.ip_address ?? '',
            device_info: rechargeData.device_info ?? '',
            remark: rechargeData.remark ?? '',
            is_first_recharge: isFirstRecharge,
            first_recharge_bonus: isFirstRecharge ? calculateFirstRechargeBonus(amount) : 0,
            created_at: Date.now()
        };
        await redis.set(REDIS_KEYS.CURRENCY_LOG(recordId), JSON.stringify(record));
        userInfo.recharge_record_ids.push(recordId);
        await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));
        return record;
    }
    catch (error) {
        logger.warn('Error creating recharge record:', error);
        throw error;
    }
};
const completeRechargePayment = async (recordId, transactionId, paymentMethod = 'unknown') => {
    if (!recordId || typeof recordId !== 'string') {
        throw new Error('Invalid record ID');
    }
    if (!transactionId || typeof transactionId !== 'string') {
        throw new Error('Invalid transaction ID');
    }
    try {
        const redis = getIoRedis();
        const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));
        if (!recordData) {
            throw new Error('Recharge record not found');
        }
        const record = JSON.parse(recordData);
        const userId = record.user_id;
        if (record.payment_status === PaymentStatus.SUCCESS) {
            logger.warn('Recharge record already completed:', recordId);
            return record;
        }
        record.payment_status = PaymentStatus.SUCCESS;
        record.transaction_id = transactionId;
        record.payment_method = paymentMethod;
        record.paid_at = Date.now();
        await redis.set(REDIS_KEYS.CURRENCY_LOG(recordId), JSON.stringify(record));
        const userInfo = await findUserRechargeInfo(userId);
        if (record.is_first_recharge) {
            userInfo.is_first_recharge = false;
            userInfo.first_recharge_time = Date.now();
        }
        const amount = getAmountByTier(record.tier);
        userInfo.total_recharge_amount += amount;
        userInfo.total_recharge_count += 1;
        userInfo.last_recharge_time = Date.now();
        userInfo.updated_at = Date.now();
        switch (record.type) {
            case RechargeType.CURRENCY:
                userInfo.currency += record.currency_gained;
                if (record.is_first_recharge) {
                    userInfo.currency += record.first_recharge_bonus;
                }
                break;
            case RechargeType.SMALL_MONTH_CARD:
                userInfo.small_month_card_days += record.month_card_days;
                break;
            case RechargeType.BIG_MONTH_CARD:
                userInfo.big_month_card_days += record.month_card_days;
                break;
            case RechargeType.COMBO:
                userInfo.currency += record.currency_gained;
                if (record.month_card_type === 'small') {
                    userInfo.small_month_card_days += record.month_card_days;
                }
                else if (record.month_card_type === 'big') {
                    userInfo.big_month_card_days += record.month_card_days;
                }
                if (record.is_first_recharge) {
                    userInfo.currency += record.first_recharge_bonus;
                }
                break;
        }
        await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));
        await updateGlobalRechargeStats(amount, record.is_first_recharge);
        return record;
    }
    catch (error) {
        logger.warn('Error completing recharge payment:', error);
        throw error;
    }
};
const rechargeUserCurrency = async (userId, tier, paymentMethod = 'unknown', ipAddress = '', deviceInfo = '') => {
    try {
        const amount = getAmountByTier(tier);
        const currencyGained = calculateCurrencyGained(amount);
        const record = await createRechargeRecord(userId, {
            type: RechargeType.CURRENCY,
            tier,
            currency_gained: currencyGained,
            payment_method: paymentMethod,
            ip_address: ipAddress,
            device_info: deviceInfo
        });
        return record;
    }
    catch (error) {
        logger.warn('Error recharging user currency:', error);
        throw error;
    }
};
const rechargeUserSmallMonthCard = async (userId, paymentMethod = 'unknown', ipAddress = '', deviceInfo = '') => {
    try {
        const { days, name } = MONTH_CARD_CONFIG.SMALL;
        const record = await createRechargeRecord(userId, {
            type: RechargeType.SMALL_MONTH_CARD,
            tier: name,
            month_card_days: days,
            month_card_type: 'small',
            payment_method: paymentMethod,
            ip_address: ipAddress,
            device_info: deviceInfo
        });
        return record;
    }
    catch (error) {
        logger.warn('Error recharging user small month card:', error);
        throw error;
    }
};
const rechargeUserBigMonthCard = async (userId, paymentMethod = 'unknown', ipAddress = '', deviceInfo = '') => {
    try {
        const { days, name } = MONTH_CARD_CONFIG.BIG;
        const record = await createRechargeRecord(userId, {
            type: RechargeType.BIG_MONTH_CARD,
            tier: name,
            month_card_days: days,
            month_card_type: 'big',
            payment_method: paymentMethod,
            ip_address: ipAddress,
            device_info: deviceInfo
        });
        return record;
    }
    catch (error) {
        logger.warn('Error recharging user big month card:', error);
        throw error;
    }
};
const getUserRechargeRecords = async (userId, limit = 20, offset = 0) => {
    try {
        const redis = getIoRedis();
        const userInfo = await findUserRechargeInfo(userId);
        const recordIds = userInfo.recharge_record_ids.slice(offset, offset + limit);
        const records = [];
        for (const recordId of recordIds) {
            const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));
            if (recordData) {
                records.push(JSON.parse(recordData));
            }
        }
        return records.sort((a, b) => b.created_at - a.created_at);
    }
    catch (error) {
        logger.warn('Error getting user recharge records:', error);
        return [];
    }
};
const getAllRechargeRecords = async (limit = 50, offset = 0, status, type) => {
    try {
        const redis = getIoRedis();
        const pattern = REDIS_KEYS.CURRENCY_LOG('*');
        const keys_list = await redis.keys(pattern);
        const records = [];
        for (const key of keys_list.slice(offset, offset + limit)) {
            const recordData = await redis.get(key);
            if (recordData) {
                const record = JSON.parse(recordData);
                if ((!status || record.payment_status === status) && (!type || record.type === type)) {
                    records.push(record);
                }
            }
        }
        return records.sort((a, b) => b.created_at - a.created_at);
    }
    catch (error) {
        logger.warn('Error getting all recharge records:', error);
        return [];
    }
};
const getRechargeRecordDetail = async (recordId) => {
    try {
        const redis = getIoRedis();
        const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));
        return recordData ? JSON.parse(recordData) : null;
    }
    catch (error) {
        logger.warn('Error getting recharge record detail:', error);
        return null;
    }
};
const updateGlobalRechargeStats = async (amount, isFirstRecharge) => {
    try {
        const redis = getIoRedis();
        const statsKey = REDIS_KEYS.GLOBAL_STATS();
        let stats = initGlobalRechargeStats;
        const statsData = await redis.get(statsKey);
        if (statsData) {
            stats = JSON.parse(statsData);
        }
        const now = Date.now();
        stats.total_amount += amount;
        stats.total_count += 1;
        stats.updated_at = now;
        if (isFirstRecharge) {
            stats.first_recharge_users += 1;
        }
        await redis.set(statsKey, JSON.stringify(stats));
    }
    catch (error) {
        logger.warn('Error updating global recharge stats:', error);
    }
};
const isTransactionIdExists = async (transactionId) => {
    try {
        const redis = getIoRedis();
        const transactionKey = REDIS_KEYS.TRANSACTION(transactionId);
        const exists = await redis.exists(transactionKey);
        if (exists === 0) {
            await redis.setex(transactionKey, CURRENCY_CONFIG.TRANSACTION_EXPIRE_TIME, '1');
        }
        return exists === 1;
    }
    catch (error) {
        logger.warn('Error checking transaction ID:', error);
        return false;
    }
};
const getGlobalRechargeStats = async () => {
    try {
        const redis = getIoRedis();
        const statsKey = REDIS_KEYS.GLOBAL_STATS();
        const statsData = await redis.get(statsKey);
        return statsData ? JSON.parse(statsData) : initGlobalRechargeStats;
    }
    catch (error) {
        logger.warn('Error getting global recharge stats:', error);
        return initGlobalRechargeStats;
    }
};
const checkUserMonthCardStatus = async (userId) => {
    try {
        const userInfo = await findUserRechargeInfo(userId);
        return {
            userId,
            small_month_card_days: userInfo.small_month_card_days,
            big_month_card_days: userInfo.big_month_card_days,
            has_small_month_card: userInfo.small_month_card_days > 0,
            has_big_month_card: userInfo.big_month_card_days > 0,
            is_first_recharge: userInfo.is_first_recharge,
            total_recharge_amount: userInfo.total_recharge_amount,
            total_recharge_count: userInfo.total_recharge_count
        };
    }
    catch (error) {
        logger.warn('Error checking user month card status:', error);
        return null;
    }
};
const consumeMonthCardDays = async (userId, cardType, days = 1) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
    }
    if (!['small', 'big'].includes(cardType)) {
        throw new Error('Invalid card type');
    }
    if (!days || days <= 0) {
        throw new Error('Invalid days amount');
    }
    try {
        const redis = getIoRedis();
        const userInfo = await findUserRechargeInfo(userId);
        if (cardType === 'small') {
            if (userInfo.small_month_card_days < days) {
                return false;
            }
            userInfo.small_month_card_days -= days;
        }
        else if (cardType === 'big') {
            if (userInfo.big_month_card_days < days) {
                return false;
            }
            userInfo.big_month_card_days -= days;
        }
        userInfo.updated_at = Date.now();
        await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));
        return true;
    }
    catch (error) {
        logger.warn('Error consuming month card days:', error);
        return false;
    }
};
const consumeUserCurrency = async (userId, amount) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
    }
    if (!amount || amount <= 0) {
        throw new Error('Invalid consumption amount');
    }
    try {
        const redis = getIoRedis();
        const userInfo = await findUserRechargeInfo(userId);
        if (userInfo.currency < amount) {
            return false;
        }
        userInfo.currency -= amount;
        userInfo.updated_at = Date.now();
        await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));
        return true;
    }
    catch (error) {
        logger.warn('Error consuming user currency:', error);
        return false;
    }
};
const getAllUsersCurrencyInfo = async (limit = 100, offset = 0) => {
    try {
        const redis = getIoRedis();
        const allKeys = await redis.keys(REDIS_KEYS.PLAYER_CURRENCY_PATTERN());
        const userKeys = allKeys.slice(offset, offset + limit);
        const users = [];
        for (const key of userKeys) {
            const userId = key.replace('data:alemonjs-xiuxian:player_currency:', '');
            const userInfo = await findUserRechargeInfo(userId);
            if (userInfo.total_recharge_count > 0 ||
                userInfo.currency > 0 ||
                userInfo.small_month_card_days > 0 ||
                userInfo.big_month_card_days > 0) {
                users.push(userInfo);
            }
        }
        users.sort((a, b) => b.last_recharge_time - a.last_recharge_time);
        return users;
    }
    catch (error) {
        logger.warn('Error getting all users currency info:', error);
        return [];
    }
};

export { CURRENCY_CONFIG, MONTH_CARD_CONFIG, PaymentStatus, RECHARGE_TIERS, REDIS_KEYS, RechargeType, calculateCurrencyGained, calculateFirstRechargeBonus, checkUserMonthCardStatus, completeRechargePayment, consumeMonthCardDays, consumeUserCurrency, createRechargeRecord, findUserRechargeInfo, getAllRechargeRecords, getAllUsersCurrencyInfo, getAmountByTier, getGlobalRechargeStats, getNextRechargeRecordId, getRechargeRecordDetail, getUserRechargeRecords, isTransactionIdExists, rechargeUserBigMonthCard, rechargeUserCurrency, rechargeUserSmallMonthCard };
