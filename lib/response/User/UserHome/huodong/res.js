import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
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
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?活动兑换.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function parseJson(raw) {
    if (typeof raw !== 'string' || !raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
const CATEGORY_SET = new Set(['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮']);
function normalizeCategory(c) {
    return CATEGORY_SET.has(c) ? c : '道具';
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const codeInput = e.MessageText.replace(/^(#|＃|\/)?活动兑换/, '').trim();
    if (!codeInput) {
        void Send(Text('请在指令后输入兑换码'));
        return false;
    }
    const list = ((await getDataList('ExchangeItem')) || []);
    const codeObj = list.find(c => c.name === codeInput);
    if (!codeObj) {
        void Send(Text('兑换码不存在!'));
        return false;
    }
    const key = getRedisKey(userId, 'duihuan');
    const usedList = parseJson(await redis.get(key)) || [];
    if (usedList.includes(codeInput)) {
        void Send(Text('你已经兑换过该兑换码了'));
        return false;
    }
    usedList.push(codeInput);
    await redis.set(key, JSON.stringify(usedList));
    const msg = [];
    for (const t of codeObj.thing || []) {
        const qty = toInt(t.数量, 0);
        if (!t.name || qty <= 0) {
            continue;
        }
        const cate = normalizeCategory(t.class);
        await addNajieThing(userId, t.name, cate, qty);
        msg.push(`\n${t.name}x${qty}`);
    }
    if (!msg.length) {
        void Send(Text('该兑换码没有有效奖励内容'));
        return false;
    }
    void Send(Text('恭喜获得:' + msg.join('')));
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
