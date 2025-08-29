import { readForum, writeForum } from '../model/trade.js';
import { addCoin } from '../model/economy.js';

const BASE_CONFIG = {
    FORUM_EXPIRY_DAYS: 3,
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000
};
const calculateDaysDifference = (recordTime, currentTime) => {
    const timeDifference = currentTime - recordTime;
    return timeDifference / BASE_CONFIG.MILLISECONDS_PER_DAY;
};
const processForumRecord = async (record, currentTime) => {
    try {
        const daysDifference = calculateDaysDifference(record.now_time, currentTime);
        if (daysDifference < BASE_CONFIG.FORUM_EXPIRY_DAYS) {
            return false;
        }
        const userId = record.qq;
        const lingshi = record.whole;
        await addCoin(userId, lingshi);
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const processForumRecords = async (records, currentTime) => {
    let processedCount = 0;
    let errorCount = 0;
    const validRecords = [];
    for (const record of records) {
        try {
            const success = await processForumRecord(record, currentTime);
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
const filterValidRecords = (records, currentTime) => {
    return records.filter(record => {
        const daysDifference = calculateDaysDifference(record.now_time, currentTime);
        return daysDifference < BASE_CONFIG.FORUM_EXPIRY_DAYS;
    });
};
const ForumTask = async () => {
    try {
        const forumRecords = await readForum();
        const currentTime = Date.now();
        if (!forumRecords || forumRecords.length === 0) {
            return;
        }
        await processForumRecords(forumRecords, currentTime);
        const validRecords = filterValidRecords(forumRecords, currentTime);
        await writeForum(validRecords);
    }
    catch (error) {
        logger.error(error);
    }
};

export { ForumTask };
