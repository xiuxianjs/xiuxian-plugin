import { getIoRedis } from '@alemonjs/db';
import { keys } from '../model/keys.js';
import '../model/DataList.js';
import '../model/XiuxianData.js';
import '../model/repository/playerRepository.js';
import '../model/repository/najieRepository.js';
import { useMessage, Text, Mention, Image } from 'alemonjs';
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
import { verifyCaptcha, generateCaptcha, svgToPngBuffer } from '../model/captcha.js';
import dayjs from 'dayjs';

const replyCount = {};
const captchaTries = {};
const MAX_CAPTCHA_TRIES = 6;
const MIN_COUNT = 90;
const MAX_COUNT = 120;
const selects = onSelects(['message.create', 'private.message.create']);
function isNight(hour) {
    return hour >= 23 || hour < 7;
}
const op = (userId) => `${baseKey}:op:${userId}:${dayjs().format('YYYYMMDDHH')}`;
var mw = onMiddleware(selects, async (event, next) => {
    const userId = event.UserId;
    const redis = getIoRedis();
    const exist = await redis.exists(keys.player(userId));
    if (exist === 0) {
        next();
        return;
    }
    const [message] = useMessage(event);
    const now = dayjs();
    const muteTtl = await redis.ttl(keys.mute(userId));
    if (muteTtl > 0) {
        const unlockTime = dayjs()
            .add(muteTtl, 'second')
            .format('YYYY-MM-DD HH:mm:ss');
        const count = replyCount[userId] || 0;
        if (count < 2) {
            message.send(format(Text(`你的修仙功能已被禁言，限制将于${unlockTime}解除。`)));
            replyCount[userId] = count + 1;
        }
        return;
    }
    const captchaExists = await redis.exists(keys.captcha(userId));
    if (captchaExists) {
        const text = event.MessageText?.trim();
        if (!/^[a-zA-Z0-9]{1,9}$/.test(text)) {
            logger.debug(`用户 ${userId} 输入的消息不符合验证码格式`);
            return;
        }
        const success = await verifyCaptcha(userId, text);
        if (success) {
            message.send(format(Text('验证码正确！'), Mention(userId)));
            await redis.del(keys.captcha(userId));
            await redis.del(keys.mute(userId));
            captchaTries[userId] = 0;
            await redis.setex(op(userId), 60 * 60 * 6, '1');
            for (let i = 1; i <= 3; i++) {
                const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH');
                const pastHourKey = `${baseKey}:op:${userId}:${checkHour}`;
                await redis.del(pastHourKey);
            }
            await redis.setex(`${baseKey}:captcha_passed:${userId}`, 60 * 60, '1');
            next();
            return;
        }
        else {
            captchaTries[userId] = (captchaTries[userId] || 0) + 1;
            if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
                message.send(format(Text('错误次数过多，你已被临时禁言6小时！'), Mention(userId)));
                await redis.setex(keys.mute(userId), 60 * 60 * 6, '1');
                await redis.del(keys.captcha(userId));
                captchaTries[userId] = 0;
                return;
            }
            else {
                const { svg, text } = await generateCaptcha();
                await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
                const img = await svgToPngBuffer(svg);
                message.send(format(Image(img), Mention(userId)));
            }
        }
        return;
    }
    let count = 0;
    for (let i = 1; i <= 3; i++) {
        const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH');
        const key = `${baseKey}:op:${userId}:${checkHour}`;
        const c = await redis.get(key);
        if (c && parseInt(c) >= 10) {
            count += parseInt(c);
        }
    }
    const hour = now.hour();
    const countLimit = isNight(hour) ? MIN_COUNT : MAX_COUNT;
    if (count > countLimit) {
        const captchaPassed = await redis.exists(`${baseKey}:captcha_passed:${userId}`);
        if (!captchaPassed) {
            const { svg, text } = await generateCaptcha();
            await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
            const img = await svgToPngBuffer(svg);
            message.send(format(Image(img), Mention(userId)));
            return;
        }
    }
    const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`;
    const opCount = await redis.incr(hourKey);
    if (opCount === 1) {
        await redis.expire(hourKey, 60 * 60 * 4);
    }
    logger.debug(`用户 ${userId} 当前操作次数: ${opCount}`);
    next();
});

export { mw as default };
