import { onResponse, useMessage, format, Text, useSubscribe, logger } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
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
import '@alemonjs/db';
import { sleep } from '../../../../model/common.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { batchAddNajieThings } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?一键出售(.*)$/;
function calculateSoldItemsPrice(soldItems, originalNajie) {
    let totalPrice = 0;
    for (const soldItem of soldItems) {
        const category = soldItem.category;
        const list = originalNajie[category];
        if (!Array.isArray(list)) {
            continue;
        }
        let item;
        if (category === '装备' && soldItem.pinji !== undefined) {
            item = list.find((l) => l && l.name === soldItem.name && l.pinji === soldItem.pinji);
        }
        else {
            item = list.find((l) => l && l.name === soldItem.name);
        }
        if (item && typeof item.出售价 === 'number') {
            const soldQuantity = Math.abs(soldItem.count);
            totalPrice += item.出售价 * soldQuantity;
        }
    }
    return totalPrice;
}
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie) {
        return false;
    }
    let wupin = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
    const wupin1 = [];
    if (e.MessageText !== '#一键出售') {
        let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');
        for (const i of wupin) {
            if (thing === i) {
                wupin1.push(i);
                thing = thing.replace(i, '');
            }
        }
        if (thing.length === 0) {
            wupin = wupin1;
        }
        else {
            return false;
        }
        const itemsToSell = [];
        for (const i of wupin) {
            const list = najie[i];
            if (!Array.isArray(list)) {
                continue;
            }
            for (const l of list) {
                if (l && (l.islockd ?? 0) === 0) {
                    const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
                    const cls = l.class || i;
                    if (quantity > 0) {
                        itemsToSell.push({
                            name: l.name,
                            count: -quantity,
                            category: cls,
                            pinji: l.pinji
                        });
                    }
                }
            }
        }
        let actualSoldItems = [];
        if (itemsToSell.length > 0) {
            actualSoldItems = await batchAddNajieThings(userId, itemsToSell);
        }
        const actualPrice = calculateSoldItemsPrice(actualSoldItems, najie);
        await addCoin(userId, actualPrice);
        void message.send(format(Text(`出售成功!  获得${actualPrice}灵石 `)));
        return false;
    }
    let goodsNum = 0;
    const goods = [];
    goods.push('正在出售:');
    for (const i of wupin) {
        const list = najie[i];
        if (!Array.isArray(list)) {
            continue;
        }
        for (const l of list) {
            if (l && (l.islockd ?? 0) === 0) {
                const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
                let displayName = l.name;
                if (i === '装备' && l.pinji !== undefined) {
                    displayName += `(${l.pinji}品)`;
                }
                goods.push('\n' + displayName + '*' + quantity);
                goodsNum++;
            }
        }
    }
    if (goodsNum === 0) {
        void message.send(format(Text('没有东西可以出售')));
        return false;
    }
    goods.push('\n回复[1]出售,回复[0]取消出售');
    for (let i = 0; i < goods.length; i += 8) {
        void message.send(format(Text(goods.slice(i, i + 8).join(''))));
        await sleep(500);
    }
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event) => {
        clearTimeout(timeout);
        const [message] = useMessage(event);
        const new_msg = event.MessageText;
        const confirm = new_msg === '1';
        if (!confirm) {
            void message.send(format(Text('已取消出售')));
            return;
        }
        const userId = event.UserId;
        const najie2 = await getDataJSONParseByKey(keys.najie(userId));
        if (!najie2) {
            void message.send(format(Text('数据缺失，出售失败')));
            return;
        }
        const wupin = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
        const itemsToSell = [];
        for (const i of wupin) {
            const list = najie2[i];
            if (!Array.isArray(list)) {
                continue;
            }
            for (const l of list) {
                if (l && (l.islockd ?? 0) === 0) {
                    const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
                    const cls = l.class || i;
                    if (quantity > 0) {
                        itemsToSell.push({
                            name: l.name,
                            count: -quantity,
                            category: cls,
                            pinji: l.pinji
                        });
                    }
                }
            }
        }
        let actualSoldItems = [];
        if (itemsToSell.length > 0) {
            actualSoldItems = await batchAddNajieThings(userId, itemsToSell);
        }
        const actualPrice = calculateSoldItemsPrice(actualSoldItems, najie2);
        await addCoin(userId, actualPrice);
        void message.send(format(Text(`出售成功!  获得${actualPrice}灵石 `)));
    }, ['UserId']);
    const timeout = setTimeout(() => {
        try {
            subscribe.cancel(sub);
            void message.send(format(Text('超时自动取消出售')));
        }
        catch (e) {
            logger.error('取消订阅失败', e);
        }
    }, 1000 * 60 * 1);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
