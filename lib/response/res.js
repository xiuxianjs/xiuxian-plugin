import { getIoRedis } from '@alemonjs/db';
import { keys, baseKey } from '../model/keys.js';
import '../model/api.js';
import { getAppCofig } from '../model/Config.js';
import { useMessage, Text, Mention, Image } from 'alemonjs';
import dayjs from 'dayjs';
import '../model/DataList.js';
import 'lodash-es';
import '../model/settions.js';
import { verifyCaptcha, generateCaptcha, svgToPngBuffer } from '../model/captcha.js';
import '../model/currency.js';
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
import '../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';
import { selects } from './mw.js';
import { replyCount, op, captchaTries, MAX_CAPTCHA_TRIES } from './config.js';

const regular = /^[a-zA-Z0-9]{1,9}$/;
var res = onResponse(selects, async (event) => {
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
        const text = event.MessageText?.trim();
        if (!/^[a-zA-Z0-9]{1,9}$/.test(text)) {
            logger.debug(`用户 ${userId} 输入的消息不符合验证码格式`);
            return;
        }
        const success = await verifyCaptcha(userId, text);
        if (success) {
            void message.send(format(Text('验证码正确！'), Mention(userId)));
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
            return true;
        }
        else {
            captchaTries[userId] = (captchaTries[userId] || 0) + 1;
            if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
                void message.send(format(Text('错误次数过多，你已被临时禁言6小时！'), Mention(userId)));
                await redis.setex(keys.mute(userId), 60 * 60 * 6, '1');
                await redis.del(keys.captcha(userId));
                captchaTries[userId] = 0;
            }
            else {
                const { svg, text } = generateCaptcha();
                await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
                const img = await svgToPngBuffer(svg);
                void message.send(format(Image(img), Mention(userId)));
            }
        }
    }
});

export { res as default, regular };
