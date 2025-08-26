import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { readForum, writeForum } from '../../../../model/trade.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?接取.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const CD_MINUTES = 0.5;
const CD_MS = CD_MINUTES * 60_000;
const MAX_QTY = 1_000_000_000;
const MAX_PRICE_SUM = 1e15;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await Go(e))) {
        return false;
    }
    const cdKey = getRedisKey(usr_qq, 'ForumCD');
    const now = Date.now();
    const last = toInt(await redis.get(cdKey), 0);
    if (now < last + CD_MS) {
        const remain = last + CD_MS - now;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        Send(Text(`每${CD_MINUTES}分钟操作一次，CD: ${m}分${s}秒`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('存档异常'));
        return false;
    }
    const body = e.MessageText.replace(/^(#|＃|\/)?接取/, '').trim();
    if (!body) {
        Send(Text('格式: 接取编号*数量 (数量可省略为全部)'));
        return false;
    }
    const seg = body
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (seg.length === 0) {
        Send(Text('指令解析失败'));
        return false;
    }
    const idxRaw = seg[0];
    const qtyRaw = seg[1];
    const orderIndex = toInt(await convert2integer(idxRaw), 0) - 1;
    if (orderIndex < 0) {
        Send(Text('编号不合法'));
        return false;
    }
    let forum = [];
    try {
        forum = await readForum();
    }
    catch {
        await writeForum([]);
        forum = [];
    }
    if (orderIndex >= forum.length) {
        Send(Text('没有该编号的求购单'));
        return false;
    }
    const orderRaw = forum[orderIndex];
    const order = {
        ...orderRaw,
        name: orderRaw.thing?.name,
        class: orderRaw.thing?.class,
        aconut: orderRaw.amount,
        price: orderRaw.last_price
    };
    if (String(order.qq) === String(usr_qq)) {
        Send(Text('没事找事做?'));
        return false;
    }
    const unitPrice = toInt(order.price, 0);
    const remaining = toInt(order.aconut, 0);
    if (unitPrice <= 0 || remaining <= 0) {
        Send(Text('该求购单已失效'));
        return false;
    }
    let deliverQty;
    if (!qtyRaw) {
        deliverQty = remaining;
    }
    else {
        deliverQty = toInt(await convert2integer(qtyRaw), 0);
        if (deliverQty <= 0) {
            Send(Text('数量需为正整数'));
            return false;
        }
    }
    if (deliverQty > remaining) {
        deliverQty = remaining;
    }
    if (deliverQty > MAX_QTY) {
        deliverQty = MAX_QTY;
    }
    const hasNum = await existNajieThing(usr_qq, order.name, order.class);
    if (!hasNum) {
        Send(Text(`你没有【${order.name}】`));
        return false;
    }
    if (hasNum < deliverQty) {
        Send(Text(`你只有【${order.name}】 x ${hasNum}`));
        return false;
    }
    const gain = unitPrice * deliverQty;
    if (!Number.isFinite(gain) || gain <= 0 || gain > MAX_PRICE_SUM) {
        Send(Text('价格计算异常'));
        return false;
    }
    await addNajieThing(usr_qq, order.name, order.class, -deliverQty);
    await addCoin(usr_qq, gain);
    await addNajieThing(String(order.qq ?? order.last_offer_player ?? ''), order.name, order.class, deliverQty);
    orderRaw.amount = remaining - deliverQty;
    if (typeof order.whole === 'number') {
        order.whole = order.whole - gain;
    }
    if (orderRaw.amount <= 0) {
        forum.splice(orderIndex, 1);
    }
    await writeForum(forum);
    Send(Text(`${player.名号}在聚宝堂收获了${gain}灵石！(交付 ${order.name} x ${deliverQty})`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
