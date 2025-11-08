import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import { getConfig } from '../../../../model/Config.js';
import { getLastSign, shijianc } from '../../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { addExp } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import { isUserMonthCard } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?修仙签到$/;
const MS_PER_DAY = 86400000;
const MONTH_CARD_CONNECT_SIGN_KEY = 'xiuxian@1.3.0:month_card_connect_sign:';
const weeklyGift = [
    { name: '五阶玄元丹', type: '丹药', account: 1 },
    { name: '五阶淬体丹', type: '丹药', account: 1 },
    { name: '仙府通行证', type: '道具', account: 1 },
    { name: '道具盲盒', type: '道具', account: 1 }
];
function isSameDay(time1, time2) {
    const d1 = shijianc(time1);
    const d2 = shijianc(time2);
    return d1.Y === d2.Y && d1.M === d2.M && d1.D === d2.D;
}
async function updateMonthCardConnectSign(userId, Send) {
    const connectSignNumKey = MONTH_CARD_CONNECT_SIGN_KEY + userId;
    const connectSignNumStr = await redis.get(connectSignNumKey);
    const connectSignNum = parseInt(connectSignNumStr ?? '0', 10);
    if (isNaN(connectSignNum)) {
        await redis.set(connectSignNumKey, '1');
    }
    else {
        const newConnectSignNum = connectSignNum + 1;
        await redis.set(connectSignNumKey, newConnectSignNum);
        if (newConnectSignNum % 7 === 0) {
            for (const item of weeklyGift) {
                await addNajieThing(userId, item.name, item.type, item.account);
            }
            const msg = weeklyGift.map(i => `${i.name}*${i.account}`).join('，');
            void Send(Text(`恭喜您额外获得${msg}`));
        }
    }
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const nowTime = Date.now();
    const yesterdayTime = nowTime - MS_PER_DAY;
    const lastSignStruct = await getLastSign(userId);
    const isMonthCard = await isUserMonthCard(userId);
    if (lastSignStruct && isSameDay(lastSignStruct.time, nowTime) && lastSignStruct.sign === 2) {
        void Send(Text('今日已经签到过了'));
        return false;
    }
    if (lastSignStruct && isSameDay(lastSignStruct.time, nowTime) && lastSignStruct.sign === 1) {
        if (!isMonthCard) {
            void Send(Text('今日已经签到过了'));
            return false;
        }
        await redis.set(getRedisKey(userId, 'lastsign_time'), JSON.stringify({ time: nowTime, sign: 2 }));
        await addNajieThing(userId, '闪闪发光的石头', '道具', 1);
        await addNajieThing(userId, '秘境之匙', '道具', 10);
        void Send(Text('补签成功，获得闪闪发光的石头*1，秘境之匙*10'));
        await updateMonthCardConnectSign(userId, Send);
        return false;
    }
    let sign = 1;
    if (isMonthCard) {
        sign = 2;
    }
    const continued = lastSignStruct && isSameDay(yesterdayTime, lastSignStruct.time);
    await redis.set(getRedisKey(userId, 'lastsign_time'), JSON.stringify({ time: nowTime, sign: sign }));
    if (!continued) {
        await redis.set(MONTH_CARD_CONNECT_SIGN_KEY + userId, 0);
    }
    if (!isMonthCard) {
        await redis.del(MONTH_CARD_CONNECT_SIGN_KEY + userId);
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    const record = player;
    const currentStreak = typeof record.连续签到天数 === 'number' && Number.isFinite(record.连续签到天数) ? record.连续签到天数 : 0;
    const newStreak = continued && currentStreak < 7 ? currentStreak + 1 : 1;
    record.连续签到天数 = newStreak;
    await writePlayer(userId, player);
    const cf = (await getConfig('xiuxian', 'xiuxian'));
    let ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0));
    const giftExp = newStreak * 3000;
    if (ticketNum > 0) {
        await addNajieThing(userId, '秘境之匙', '道具', ticketNum);
    }
    let msg = '';
    if (isMonthCard) {
        await addNajieThing(userId, '闪闪发光的石头', '道具', 1);
        await addNajieThing(userId, '秘境之匙', '道具', 10);
        ticketNum += 10;
        msg = ',闪闪发光的石头*1';
        await updateMonthCardConnectSign(userId, Send);
    }
    await addExp(userId, giftExp);
    void Send(Text(`已经连续签到${newStreak}天，获得修为${giftExp}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''} ${msg}`));
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
