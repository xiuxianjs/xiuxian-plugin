import { getRedisKey } from '../../../../model/keys.js';
import { useSend, useMention, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { addExp } from '../../../../model/economy.js';
import { existHunyin, fstaddQinmidu, addQinmidu } from '../../../../model/qinmidu.js';
import { findQinmidu } from '../../../../types/player.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?双修$/;
function toInt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : 0;
}
function formatRemain(ms) {
    if (ms <= 0) {
        return '0分 0秒';
    }
    const m = Math.trunc(ms / 60000);
    const s = Math.trunc((ms % 60000) / 1000);
    return `${m}分 ${s}秒`;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    if (!cf?.sw?.couple) {
        return false;
    }
    const A = e.UserId;
    let B;
    try {
        const [mention] = useMention(e);
        const res = await mention.findOne();
        const target = res?.data;
        if (!target || res.code !== 2000) {
            return false;
        }
        if (target) {
            B = target.UserId;
        }
    }
    catch {
    }
    if (!B) {
        return false;
    }
    if (A === B) {
        void Send(Text('你咋这么爱撸自己呢?'));
        return false;
    }
    if (!(await existplayer(B))) {
        void Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const cooldownMinutes = toInt(cf?.CD?.couple);
    const cooldownMs = cooldownMinutes * 60000;
    const now = Date.now();
    async function checkAndGetRemain(_userId, key) {
        const lastRaw = await redis.get(key);
        const last = toInt(lastRaw);
        const remain = last + cooldownMs - now;
        return { last, remain };
    }
    const keyA = getRedisKey(A, 'last_shuangxiu_time');
    const keyB = getRedisKey(B, 'last_shuangxiu_time');
    if (cooldownMs > 0) {
        const [{ remain: remainA }, { remain: remainB }] = await Promise.all([checkAndGetRemain(A, keyA), checkAndGetRemain(B, keyB)]);
        if (remainA > 0) {
            void Send(Text(`双修冷却:  ${formatRemain(remainA)}`));
            return false;
        }
        if (remainB > 0) {
            void Send(Text(`对方双修冷却:  ${formatRemain(remainB)}`));
            return false;
        }
    }
    const coupleFlag = toInt(await redis.get(getRedisKey(B, 'couple')));
    if (coupleFlag !== 0) {
        void Send(Text('哎哟，你干嘛...'));
        return false;
    }
    const pd = await findQinmidu(A, B);
    const hunyinOfA = await existHunyin(A);
    const hunyinOfB = await existHunyin(B);
    if (hunyinOfA !== '' || hunyinOfB !== '') {
        if (hunyinOfA !== B || hunyinOfB !== A) {
            void Send(Text('力争纯爱！禁止贴贴！！'));
            return false;
        }
    }
    else if (pd === false) {
        await fstaddQinmidu(A, B);
    }
    await Promise.all([redis.set(keyA, now), redis.set(keyB, now)]);
    const scenarios = [
        {
            range: [0, 0.5],
            base: 28000,
            intimacy: 30,
            text: '你们双方情意相通，缠绵一晚，都增加了'
        },
        {
            range: [0.5, 0.6],
            base: 21000,
            intimacy: 20,
            text: '你们双方交心交神，努力修炼，都增加了'
        },
        {
            range: [0.6, 0.7],
            base: 14000,
            intimacy: 15,
            text: '你们双方共同修炼，过程平稳，都增加了'
        },
        {
            range: [0.7, 0.9],
            base: 520,
            intimacy: 10,
            text: '你们双方努力修炼，但是并进不了状态，都增加了'
        }
    ];
    const rand = Math.random();
    const efficiency = Math.random();
    const scenario = scenarios.find(s => rand > s.range[0] && rand <= s.range[1]);
    if (!scenario) {
        void Send(Text('你们双修时心神合一，但是不知道哪来的小孩，惊断了状态'));
        return false;
    }
    const gain = Math.trunc(efficiency * scenario.base);
    await Promise.all([addExp(A, gain), addExp(B, gain), addQinmidu(A, B, scenario.intimacy)]);
    void Send(Text(`${scenario.text}${gain}修为,亲密度增加了${scenario.intimacy}点`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
