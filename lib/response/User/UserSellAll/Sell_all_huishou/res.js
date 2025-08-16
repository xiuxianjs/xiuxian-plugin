import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { addCoin } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
import 'dayjs';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键回收(.*)$/;
const CATEGORIES = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
];
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
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const najie = (await data.getData('najie', usr_qq));
    if (!najie) {
        Send(Text('纳戒数据异常'));
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
        if (!Array.isArray(arr) || arr.length === 0)
            continue;
        for (const item of arr) {
            if (!item || !item.name)
                continue;
            const thing = await foundthing(item.name);
            if (!thing)
                continue;
            const qty = num(item.数量);
            if (qty <= 0)
                continue;
            const salePrice = num(item.出售价);
            if (salePrice <= 0)
                continue;
            const multiplier = normalizeCat(item.class) === '材料' ||
                normalizeCat(item.class) === '草药'
                ? 1
                : 2;
            total += salePrice * qty * multiplier;
            await addNajieThing(usr_qq, item.name, normAddCat(item.class), -qty, normPinji(item.pinji));
            soldCount += qty;
        }
    }
    if (total <= 0) {
        Send(Text('没有可回收的物品'));
        return false;
    }
    await addCoin(usr_qq, total);
    Send(Text(`回收成功，出售 ${soldCount} 件物品，获得 ${total} 灵石`));
    return false;
});

export { res as default, regular };
