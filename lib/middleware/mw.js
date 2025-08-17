import { getIoRedis } from '@alemonjs/db';
import { keys } from '../model/keys.js';
import '../model/DataList.js';
import '../model/XiuxianData.js';
import '../model/repository/playerRepository.js';
import '../model/repository/najieRepository.js';
import { useMessage, Text, Image } from 'alemonjs';
import 'lodash-es';
import { baseKey } from '../model/constants.js';
import '../model/settions.js';
import '../model/api.js';
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
import { generateCaptcha, verifyCaptcha, svgToPngBuffer } from '../model/captcha.js';
import dayjs from 'dayjs';

const replyCount = {};
const captchaTries = {};
const MAX_CAPTCHA_TRIES = 10;
const selects = onSelects(['message.create', 'private.message.create']);
function isNight(hour) {
    return hour >= 23 || hour < 7;
}
var mw = onMiddleware(selects, async (event, next) => {
    const userId = event.UserId;
    const redis = getIoRedis();
    const [message] = useMessage(event);
    const muteTime = await redis.get(keys.mute(userId));
    if (muteTime) {
        const count = replyCount[userId] || 0;
        if (count < 3) {
            message.send(format(Text(`修仙功能已被禁言，限制将于${dayjs(muteTime).format('YYYY-MM-DD HH:mm:ss')}解除。`)));
            replyCount[userId] = count + 1;
        }
        return;
    }
    const captchaExists = await redis.exists(keys.captcha(userId));
    if (captchaExists) {
        const text = event.MessageText?.trim();
        if (!text) {
            const captcha = await generateCaptcha(userId);
            message.send(format(Image(Buffer.from(captcha, 'utf8'))));
            return;
        }
        const success = await verifyCaptcha(userId, text);
        if (success) {
            message.send(format(Text('验证码正确，欢迎继续操作！')));
            redis.del(keys.captcha(userId));
            redis.del(keys.mute(userId));
            captchaTries[userId] = 0;
            next();
            return;
        }
        else {
            captchaTries[userId] = (captchaTries[userId] || 0) + 1;
            if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
                message.send(format(Text('错误次数过多，你已被临时禁言6小时！')));
                await redis.set(keys.mute(userId), Date.now() + 1000 * 60 * 60 * 6, 'PX', 1000 * 60 * 60 * 6);
                await redis.del(keys.captcha(userId));
                captchaTries[userId] = 0;
                return;
            }
            else {
                const captcha = await generateCaptcha(userId);
                const img = await svgToPngBuffer(captcha);
                message.send(format(Image(img)));
            }
        }
        return;
    }
    const now = dayjs();
    const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`;
    const opCount = await redis.incr(hourKey);
    if (opCount === 1) {
        await redis.expire(hourKey, 60 * 60 * 4);
    }
    const hour = now.hour();
    const hourLimit = isNight(hour) ? 60 : 90;
    if (opCount >= hourLimit) {
        const captcha = await generateCaptcha(userId);
        const img = await svgToPngBuffer(captcha);
        message.send(format(Image(img)));
        return;
    }
    let allActive = true;
    for (let i = 0; i < 3; i++) {
        const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH');
        const key = `${baseKey}:op:${userId}:${checkHour}`;
        const count = await redis.get(key);
        if (!count || parseInt(count) === 0) {
            allActive = false;
            break;
        }
    }
    if (allActive) {
        const captcha = await generateCaptcha(userId);
        const img = await svgToPngBuffer(captcha);
        message.send(format(Image(img)));
        return;
    }
    next();
});

export { mw as default };
