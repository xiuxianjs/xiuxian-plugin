import { readForum, writeForum } from '../../model/trade.js';
import { addCoin } from '../../model/economy.js';
import '../../model/api.js';
import { keysLock } from '../../model/keys.js';
import '@alemonjs/db';
import '../../model/DataList.js';
import 'alemonjs';
import 'dayjs';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { withLock } from '../../model/locks.js';

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
const startTask = async () => {
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
const executeBossBattleWithLock = async () => {
    const lockKey = keysLock.task('ForumTask');
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
        logger.warn('ForumTask lock failed:', result.error);
    }
};
const ForumTask = () => {
    const delay = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
    setTimeout(() => {
        void executeBossBattleWithLock();
    }, delay * 1000);
};

export { ForumTask };
