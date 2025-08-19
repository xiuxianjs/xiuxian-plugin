import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readNajie } from '../../../../model/xiuxian_impl.js';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/XiuxianData.js';
import { addCoin } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
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
import { selects } from '../../../mw.js';

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
    if (!raw)
        return undefined;
    if (raw in PINJI_MAP)
        return PINJI_MAP[raw];
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const najie = await readNajie(usr_qq);
    if (!najie)
        return false;
    const raw = e.MessageText.replace(/^(#|＃|\/)?出售/, '').trim();
    if (!raw) {
        Send(Text('格式：出售 物品名*(品级)*数量  例如: 出售 血气丹*10 / 出售 斩仙剑*优*1'));
        return false;
    }
    const segs = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (!segs.length) {
        Send(Text('未检测到物品名'));
        return false;
    }
    let thingName = segs[0];
    const codeNum = Number(segs[0]);
    if (Number.isInteger(codeNum)) {
        try {
            if (codeNum > 1000)
                thingName = najie.仙宠[codeNum - 1001]?.name || thingName;
            else if (codeNum > 100)
                thingName = najie.装备[codeNum - 101]?.name || thingName;
        }
        catch {
            Send(Text('代号解析失败'));
            return false;
        }
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
    let amount = await convert2integer(amountStr);
    if (!amount || amount <= 0)
        amount = 1;
    if ((itemClass === '装备' || itemClass === '仙宠') && amount !== 1) {
        amount = 1;
    }
    if (itemClass === '装备' && pinji === undefined) {
        const allEqu = (najie.装备 || []).filter(i => i.name === thingName);
        if (!allEqu.length) {
            Send(Text(`你没有[${thingName}]`));
            return false;
        }
        const best = allEqu.reduce((p, c) => toInt(c.pinji) > toInt(p.pinji) ? c : p);
        pinji = toInt(best.pinji, 0);
    }
    const owned = await existNajieThing(usr_qq, thingName, itemClass, pinji);
    if (!owned || owned < amount) {
        Send(Text(`你只有[${thingName}]*${owned || 0}`));
        return false;
    }
    await addNajieThing(usr_qq, thingName, itemClass, -amount, pinji);
    let price = toInt(thingDef['出售价']) * amount;
    const data = {
        zalei: await getDataList('Zalei')
    };
    if (data.zalei.find(it => it.name === thingName.replace(/[0-9]+/g, ''))) {
        const sel = (najie.装备 || []).find(i => i.name === thingName && toInt(i.pinji) === (pinji ?? 0));
        if (sel)
            price = toInt(sel.出售价) * amount;
    }
    if (price <= 0)
        price = 1;
    await addCoin(usr_qq, price);
    const remain = (await existNajieThing(usr_qq, thingName, itemClass, pinji)) || 0;
    Send(Text(`出售成功! 获得${price}灵石, 剩余 ${thingName}*${remain}`));
    return false;
});

export { res as default, regular };
