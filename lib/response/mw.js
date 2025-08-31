import { getIoRedis } from '@alemonjs/db';
import '../model/api.js';
import { keys, baseKey } from '../model/keys.js';
import { getAppCofig } from '../model/Config.js';
import { useMessage, Text, Image, Mention } from 'alemonjs';
import dayjs from 'dayjs';
import '../model/DataList.js';
import '../model/settions.js';
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
import '../resources/html/monthCard.js';
import { generateCaptcha, svgToPngBuffer } from '../model/captcha.js';
import 'lodash-es';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';
import { replyCount, isNight, MIN_COUNT, MAX_COUNT } from './config.js';

const selects = onSelects(['message.create', 'private.message.create', 'private.interaction.create', 'interaction.create']);
const mw = onResponse(selects, async (event) => {
    const values = getAppCofig();
    if (values?.close_captcha) {
        return true;
    }
    const userId = event.UserId;
    const redis = getIoRedis();
    const exist = await redis.exists(keys.player(userId));
    if (exist === 0) {
        return true;
    }
    const [message] = useMessage(event);
    const now = dayjs();
    const muteTtl = await redis.ttl(keys.mute(userId));
    if (muteTtl > 0) {
        const unlockTime = dayjs().add(muteTtl, 'second').format('YYYY-MM-DD HH:mm:ss');
        const count = replyCount[userId] || 0;
        if (count < 2) {
            void message.send(format(Text(`你的修仙功能已被禁言，限制将于${unlockTime}解除。`)));
            replyCount[userId] = count + 1;
        }
        return;
    }
    const captchaExists = await redis.exists(keys.captcha(userId));
    if (captchaExists) {
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
            const { svg, text } = generateCaptcha();
            await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
            const img = await svgToPngBuffer(svg);
            void message.send(format(Image(img), Mention(userId)));
            return;
        }
    }
    const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`;
    const opCount = await redis.incr(hourKey);
    if (opCount === 1) {
        await redis.expire(hourKey, 60 * 60 * 4);
    }
    logger.debug(`用户 ${userId} 当前操作次数: ${opCount}`);
    return true;
});

export { mw as default, selects };
