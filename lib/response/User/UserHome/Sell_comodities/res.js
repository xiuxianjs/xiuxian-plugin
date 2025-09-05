import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readNajie } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import 'crypto';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?出售\S+(?:\*\S+){0,2}$/;
function toInt(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : def;
}
const PINJI_MAP = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
};
function parsePinji(raw) {
    if (!raw) {
        return undefined;
    }
    if (raw in PINJI_MAP) {
        return PINJI_MAP[raw];
    }
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?出售/, '').trim();
    if (!raw) {
        void Send(Text('格式：出售 物品名*(品级)*数量  例如: 出售 血气丹*10 / 出售 斩仙剑*优*1'));
        return false;
    }
    const segs = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (!segs.length) {
        void Send(Text('未检测到物品名'));
        return false;
    }
    let thingName = segs[0];
    const codeNum = Number(segs[0]);
    if (Number.isInteger(codeNum)) {
        try {
            if (codeNum > 1000) {
                thingName = najie.仙宠[codeNum - 1001]?.name || thingName;
            }
            else if (codeNum > 100) {
                thingName = najie.装备[codeNum - 101]?.name || thingName;
            }
        }
        catch {
            void Send(Text('代号解析失败'));
            return false;
        }
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        void Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    const itemClass = String(thingDef.class || '道具');
    let pinji;
    let amountStr;
    if (itemClass === '装备') {
        const maybePinji = parsePinji(segs[1]);
        if (maybePinji !== undefined) {
            pinji = maybePinji;
            amountStr = segs[2];
        }
        else {
            amountStr = segs[1];
        }
    }
    else {
        amountStr = segs[1];
    }
    let amount = convert2integer(amountStr);
    if (!amount || amount <= 0) {
        amount = 1;
    }
    if ((itemClass === '装备' || itemClass === '仙宠') && amount !== 1) {
        amount = 1;
    }
    if (itemClass === '装备' && pinji === undefined) {
        const allEqu = (najie.装备 || []).filter(i => i.name === thingName);
        if (!allEqu.length) {
            void Send(Text(`你没有[${thingName}]`));
            return false;
        }
        const best = allEqu.reduce((p, c) => (toInt(c.pinji) > toInt(p.pinji) ? c : p));
        pinji = toInt(best.pinji, 0);
    }
    const owned = await existNajieThing(userId, thingName, itemClass, pinji);
    if (!owned || owned < amount) {
        void Send(Text(`你只有[${thingName}]*${owned || 0}`));
        return false;
    }
    await addNajieThing(userId, thingName, itemClass, -amount, pinji);
    let price = toInt(thingDef['出售价']) * amount;
    const zalei = await getDataList('Zalei');
    if (zalei.find(it => it.name === thingName.replace(/[0-9]+/g, ''))) {
        const sel = (najie.装备 || []).find(i => i.name === thingName && toInt(i.pinji) === (pinji ?? 0));
        if (sel) {
            price = toInt(sel.出售价) * amount;
        }
    }
    if (price <= 0) {
        price = 1;
    }
    await addCoin(userId, price);
    const remain = (await existNajieThing(userId, thingName, itemClass, pinji)) || 0;
    void Send(Text(`出售成功! 获得${price}灵石, 剩余 ${thingName}*${remain}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
