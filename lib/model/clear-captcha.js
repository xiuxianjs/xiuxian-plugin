import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';
import 'alemonjs';
import './DataList.js';
import './xiuxian_impl.js';
import './XiuxianData.js';
import 'lodash-es';
import { baseKey } from './constants.js';
import './settions.js';
import './api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import 'classnames';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../route/core/auth.js';

async function clearCaptchaRecords(userId) {
    const redis = getIoRedis();
    try {
        if (userId) {
            await clearUserCaptchaRecords(redis, userId);
            console.log(`已清理用户 ${userId} 的验证码记录`);
        }
        else {
            await clearAllCaptchaRecords(redis);
            console.log('已清理所有用户的验证码记录');
        }
    }
    catch (error) {
        console.error('清理验证码记录失败:', error);
    }
}
async function clearUserCaptchaRecords(redis, userId) {
    await redis.del(keys.captcha(userId));
    await redis.del(keys.mute(userId));
    const now = new Date();
    for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourKey = `${baseKey}:op:${userId}:${hour.getFullYear()}${String(hour.getMonth() + 1).padStart(2, '0')}${String(hour.getDate()).padStart(2, '0')}${String(hour.getHours()).padStart(2, '0')}`;
        await redis.del(hourKey);
    }
    await redis.del(`${baseKey}:captcha_passed:${userId}`);
}
async function clearAllCaptchaRecords(redis) {
    const captchaPattern = keys.captcha('*');
    const mutePattern = keys.mute('*');
    const opPattern = `${baseKey}:op:*`;
    const captchaKeys = await redis.keys(captchaPattern);
    if (captchaKeys.length > 0) {
        await redis.del(...captchaKeys);
        console.log(`清理了 ${captchaKeys.length} 个验证码记录`);
    }
    const muteKeys = await redis.keys(mutePattern);
    if (muteKeys.length > 0) {
        await redis.del(...muteKeys);
        console.log(`清理了 ${muteKeys.length} 个禁言记录`);
    }
    const opKeys = await redis.keys(opPattern);
    if (opKeys.length > 0) {
        await redis.del(...opKeys);
        console.log(`清理了 ${opKeys.length} 个操作计数记录`);
    }
}

export { clearCaptchaRecords };
