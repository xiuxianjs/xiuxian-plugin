import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../../../../model/Config.js';
import { shijianc, getLastsign } from '../../../../model/common.js';
import { existplayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { addExp } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?修仙签到$/;
function isLastSignStruct(v) {
    if (!v || typeof v !== 'object') {
        return false;
    }
    const obj = v;
    return typeof obj.Y === 'number' && typeof obj.M === 'number' && typeof obj.D === 'number';
}
const isSameDay = (a, b) => a.Y === b.Y && a.M === b.M && a.D === b.D;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const nowTime = Date.now();
    const yesterdayStruct = shijianc(nowTime - 24 * 60 * 60 * 1000);
    const todayStruct = shijianc(nowTime);
    const lastSignStruct = await getLastsign(userId);
    if (isLastSignStruct(lastSignStruct) && isLastSignStruct(todayStruct) && isSameDay(todayStruct, lastSignStruct)) {
        void Send(Text('今日已经签到过了'));
        return false;
    }
    const continued = isLastSignStruct(lastSignStruct) && isLastSignStruct(yesterdayStruct) && isSameDay(yesterdayStruct, lastSignStruct);
    await redis.set(getRedisKey(userId, 'lastsign_time'), String(nowTime));
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    const record = player;
    let currentStreak = 0;
    const rawStreak = record['连续签到天数'];
    if (typeof rawStreak === 'number' && Number.isFinite(rawStreak)) {
        currentStreak = rawStreak;
    }
    let newStreak = currentStreak === 7 || !continued ? 0 : currentStreak;
    newStreak += 1;
    record.连续签到天数 = newStreak;
    await writePlayer(userId, player);
    const cf = (await getConfig('xiuxian', 'xiuxian'));
    const ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0));
    const gift_xiuwei = newStreak * 3000;
    if (ticketNum > 0) {
        await addNajieThing(userId, '秘境之匙', '道具', ticketNum);
    }
    await addExp(userId, gift_xiuwei);
    void Send(Text(`已经连续签到${newStreak}天，获得修为${gift_xiuwei}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
