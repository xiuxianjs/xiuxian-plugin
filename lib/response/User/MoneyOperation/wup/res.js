import { useSend, useMention, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'dayjs';
import { addCoin, addExp, addExp2 } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/api.js';
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
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?发\S+(?:\*\S+){1,2}$/;
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
    if (Number.isInteger(n) && n >= 0 && n <= 6) {
        return n;
    }
    return undefined;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    let targetQQ;
    try {
        const [mention] = useMention(e);
        const res = await mention.findOne();
        const target = res?.data;
        if (!target || res.code !== 2000) {
            return false;
        }
        if (target) {
            targetQQ = target.UserId;
        }
    }
    catch {
    }
    if (!targetQQ) {
        return false;
    }
    if (!(await existplayer(targetQQ))) {
        Send(Text('对方无踏入仙途'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?发/, '');
    const parts = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (parts.length < 2) {
        Send(Text('格式错误，应为: 发 资源名*数量 或 发 装备名*品级*数量'));
        return false;
    }
    const thingName = parts[0];
    if (thingName === '灵石' || thingName === '修为' || thingName === '血气') {
        const amount = toInt(parts[1], 1);
        if (amount <= 0) {
            Send(Text('数量需为正整数'));
            return false;
        }
        if (thingName === '灵石') {
            await addCoin(targetQQ, amount);
        }
        else if (thingName === '修为') {
            await addExp(targetQQ, amount);
        }
        else {
            await addExp2(targetQQ, amount);
        }
        Send(Text(`发放成功: ${thingName} x ${amount}`));
        return false;
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    const itemClass = String(thingDef.class || '道具');
    let pinji;
    let amountStr;
    if (itemClass === '装备') {
        const maybePinji = parsePinji(parts[1]);
        if (maybePinji !== undefined) {
            pinji = maybePinji;
            amountStr = parts[2];
        }
        else {
            amountStr = parts[1];
        }
    }
    else {
        amountStr = parts[1];
    }
    const amount = toInt(amountStr, 1);
    if (amount <= 0) {
        Send(Text('数量需为正整数'));
        return false;
    }
    await addNajieThing(targetQQ, thingName, itemClass, amount, pinji);
    Send(Text(`发放成功, 增加${thingName} x ${amount}${pinji !== undefined ? ` (品级:${pinji})` : ''}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
