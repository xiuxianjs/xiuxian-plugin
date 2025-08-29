import { readExchange, writeExchange } from '../model/trade.js';
import { addNajieThing } from '../model/najie.js';

const BASE_CONFIG = {
    EXCHANGE_EXPIRY_DAYS: 3,
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000
};
const isLegacyRecord = (record) => {
    return record && typeof record === 'object' && 'now_time' in record;
};
const calculateDaysDifference = (recordTime, currentTime) => {
    const timeDifference = currentTime - recordTime;
    return timeDifference / BASE_CONFIG.MILLISECONDS_PER_DAY;
};
const processLegacyRecord = async (record, currentTime) => {
    try {
        const daysDifference = calculateDaysDifference(record.now_time, currentTime);
        if (daysDifference < BASE_CONFIG.EXCHANGE_EXPIRY_DAYS) {
            return false;
        }
        const userId = record.qq;
        const item = record.thing;
        const quantity = record.aconut;
        await addNajieThing(userId, item.name, item.class, quantity, Number(item.pinji));
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const processLegacyRecords = async (records, currentTime) => {
    let processedCount = 0;
    let errorCount = 0;
    const validRecords = [];
    for (const record of records) {
        try {
            const success = await processLegacyRecord(record, currentTime);
            if (success) {
                processedCount++;
            }
            else {
                validRecords.push(record);
            }
        }
        catch (error) {
            logger.error(error);
            errorCount++;
            validRecords.push(record);
        }
    }
    return {
        success: processedCount > 0 || errorCount === 0,
        processedCount,
        errorCount,
        message: `处理了 ${processedCount} 条过期记录，${errorCount} 条记录处理失败`
    };
};
const validateLegacyFormat = (records) => {
    if (!records || records.length === 0) {
        return false;
    }
    return isLegacyRecord(records[0]);
};
const ExchangeTask = async () => {
    try {
        const exchangeRecords = await readExchange();
        const currentTime = Date.now();
        if (!validateLegacyFormat(exchangeRecords)) {
            return {
                success: true,
                processedCount: 0,
                errorCount: 0,
                message: '没有需要处理的旧格式兑换记录'
            };
        }
        await processLegacyRecords(exchangeRecords, currentTime);
        const validRecords = exchangeRecords.filter(record => {
            if (!isLegacyRecord(record)) {
                return true;
            }
            const daysDifference = calculateDaysDifference(record.now_time, currentTime);
            return daysDifference < BASE_CONFIG.EXCHANGE_EXPIRY_DAYS;
        });
        await writeExchange(validRecords);
    }
    catch (error) {
        logger.error(error);
    }
};

export { ExchangeTask };
