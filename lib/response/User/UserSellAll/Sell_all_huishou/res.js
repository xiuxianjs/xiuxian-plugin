import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import { addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?一键回收(.*)$/;
const CATEGORIES = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
function num(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
}
function normalizeCat(v) {
    return String(v ?? '');
}
function normAddCat(v) {
    return String(v);
}
function normPinji(v) {
    return v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie) {
        void Send(Text('纳戒数据异常'));
        return false;
    }
    const rawTail = e.MessageText.replace(/^(#|＃|\/)?一键回收/, '').trim();
    let targetCats = [...CATEGORIES];
    if (rawTail && rawTail !== '') {
        const chosen = [];
        let rest = rawTail;
        for (const cat of CATEGORIES) {
            if (rest.includes(cat)) {
                chosen.push(cat);
                rest = rest.replace(new RegExp(cat, 'g'), '');
            }
        }
        rest = rest.trim();
        if (chosen.length === 0 || rest.length > 0) {
            return false;
        }
        targetCats = chosen;
    }
    let total = 0;
    let soldCount = 0;
    for (const cat of targetCats) {
        const arr = najie[cat];
        if (!Array.isArray(arr) || arr.length === 0) {
            continue;
        }
        for (const item of arr) {
            if (!item?.name) {
                continue;
            }
            const thing = await foundthing(item.name);
            if (!thing) {
                continue;
            }
            const qty = num(item.数量);
            if (qty <= 0) {
                continue;
            }
            const salePrice = num(item.出售价);
            if (salePrice <= 0) {
                continue;
            }
            const multiplier = normalizeCat(item.class) === '材料' || normalizeCat(item.class) === '草药' ? 1 : 2;
            total += salePrice * qty * multiplier;
            await addNajieThing(userId, item.name, normAddCat(item.class), -qty, normPinji(item.pinji));
            soldCount += qty;
        }
    }
    if (total <= 0) {
        void Send(Text('没有可回收的物品'));
        return false;
    }
    await addCoin(userId, total);
    void Send(Text(`回收成功，出售 ${soldCount} 件物品，获得 ${total} 灵石`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
