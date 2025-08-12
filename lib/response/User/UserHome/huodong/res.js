import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?活动兑换.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function parseJson(raw) {
    if (typeof raw !== 'string' || !raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
const CATEGORY_SET = new Set([
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
]);
function normalizeCategory(c) {
    return CATEGORY_SET.has(c) ? c : '道具';
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const codeInput = e.MessageText.replace(/^(#|＃|\/)?活动兑换/, '').trim();
    if (!codeInput) {
        Send(Text('请在指令后输入兑换码'));
        return false;
    }
    const list = (data.duihuan || []);
    const codeObj = list.find(c => c.name === codeInput);
    if (!codeObj) {
        Send(Text('兑换码不存在!'));
        return false;
    }
    const key = `xiuxian@1.3.0:${usr_qq}:duihuan`;
    const usedList = parseJson(await redis.get(key)) || [];
    if (usedList.includes(codeInput)) {
        Send(Text('你已经兑换过该兑换码了'));
        return false;
    }
    usedList.push(codeInput);
    await redis.set(key, JSON.stringify(usedList));
    const msg = [];
    for (const t of codeObj.thing || []) {
        const qty = toInt(t.数量, 0);
        if (!t.name || qty <= 0)
            continue;
        const cate = normalizeCategory(t.class);
        await addNajieThing(usr_qq, t.name, cate, qty);
        msg.push(`\n${t.name}x${qty}`);
    }
    if (!msg.length) {
        Send(Text('该兑换码没有有效奖励内容'));
        return false;
    }
    Send(Text('恭喜获得:' + msg.join('')));
    return false;
});

export { res as default, regular };
