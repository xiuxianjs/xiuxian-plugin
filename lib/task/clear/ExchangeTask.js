import { readExchange, writeExchange } from '../../model/trade.js';
import { addNajieThing } from '../../model/najie.js';
import '../../model/api.js';
import { keysLock } from '../../model/keys.js';
import '@alemonjs/db';
import 'alemonjs';
import 'dayjs';
import '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'svg-captcha';
import 'sharp';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { withLock } from '../../model/locks.js';

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
const startTask = async () => {
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
const executeBossBattleWithLock = async () => {
    const lockKey = keysLock.task('ExchangeTask');
    const result = await withLock(lockKey, async () => {
        await startTask();
    }, {
        timeout: 1000 * 25,
        retryDelay: 100,
        maxRetries: 0,
        enableRenewal: true,
        renewalInterval: 1000 * 10
    });
    if (!result.success) {
        logger.warn('ExchangeTask lock failed:', result.error);
    }
};
const ExchangeTask = () => {
    const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;
    setTimeout(() => {
        void executeBossBattleWithLock();
    }, delay * 1000);
};

export { ExchangeTask };
