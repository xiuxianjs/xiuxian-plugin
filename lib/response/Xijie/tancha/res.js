import { useSend, Text, Image } from 'alemonjs';
import { getString, userKey } from '../../../model/utils/redisHelper.js';
import { readAction, isActionRunning, formatRemaining, remainingMs } from '../../../model/actionHelper.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import '../../../model/api.js';
import { getDataList } from '../../../model/DataList.js';
import { screenshot } from '../../../image/index.js';
import 'dayjs';
import { existplayer, readPlayer } from '../../../model/xiuxiandata.js';
import { addCoin } from '../../../model/economy.js';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import { readShop, writeShop, existshop } from '../../../model/shop.js';
import '../../../model/message.js';
import mw, { selects } from '../../mw-captcha.js';

const regular = /^(#|＃|\/)?探查.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const action = await readAction(userId);
    if (isActionRunning(action)) {
        void Send(Text(`正在${action.action}中,剩余时间:${formatRemaining(remainingMs(action))}`));
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?探查/, '');
    didian = didian.trim();
    let shop;
    try {
        shop = await readShop();
    }
    catch {
        const shopList = await getDataList('Shop');
        const converted = shopList.map(item => ({
            name: item.name,
            one: item.one || [],
            ...item
        }));
        await writeShop(converted);
        shop = await readShop();
    }
    let i;
    for (i = 0; i < shop.length; i++) {
        if (shop[i].name === didian) {
            break;
        }
    }
    if (i === shop.length) {
        return false;
    }
    const player = await readPlayer(userId);
    const Price = shop[i].price * 0.3;
    if (player.灵石 < Price) {
        void Send(Text('你需要更多的灵石去打探消息'));
        return false;
    }
    await addCoin(userId, -Price);
    const thing = await existshop(didian);
    let level = shop[i].Grade;
    let state = shop[i].state;
    switch (level) {
        case 1:
            level = '松懈';
            break;
        case 2:
            level = '戒备';
            break;
        case 3:
            level = '恐慌';
            break;
    }
    switch (state) {
        case 0:
            state = '营业';
            break;
        case 1:
            state = '打烊';
            break;
    }
    const didian_data = { name: shop[i].name, level, state, thing };
    const img = await screenshot('shop', e.UserId, didian_data);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
