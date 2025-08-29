import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { getString, userKey, setValue } from '../../../model/utils/redisHelper.js';
import { getRedisKey } from '../../../model/keys.js';
import '@alemonjs/db';
import { readAction, isActionRunning, formatRemaining, remainingMs, startAction } from '../../../model/actionHelper.js';
import { shijianc } from '../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../model/xiuxiandata.js';
import { getDataList } from '../../../model/DataList.js';
import 'lodash-es';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../model/currency.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import 'posthog-node';
import { setDataByUserId } from '../../../model/Redis.js';
import { readShop, writeShop } from '../../../model/shop.js';
import '../../../model/message.js';
import mw, { selects } from '../../mw.js';

const regular = /^(#|＃|\/)?洗劫.*$/;
function isShopItem(v) {
    return !!v && typeof v === 'object' && 'name' in v;
}
const num = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const current = await readAction(userId);
    if (isActionRunning(current)) {
        void Send(Text(`正在${current?.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const now_time = Date.now();
    const lastxijie_raw = await redis.get(getRedisKey(userId, 'lastxijie_time'));
    const lastxijie_time = lastxijie_raw ? parseInt(lastxijie_raw, 10) : 0;
    const cdMs = 120 * 60 * 1000;
    if (now_time < lastxijie_time + cdMs) {
        const remain = lastxijie_time + cdMs - now_time;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`每120分钟洗劫一次，正在CD中，剩余cd: ${m}分${s}秒`));
        return false;
    }
    const Today = shijianc(now_time);
    if (Today.h > 19 && Today.h < 21) {
        void Send(Text('每日20-21点商店修整中,请过会再来'));
        return false;
    }
    const didian = e.MessageText.replace(/^(#|＃|\/)?洗劫/, '').trim();
    if (!didian) {
        void Send(Text('请指定洗劫目标地点'));
        return false;
    }
    let shop = await readShop();
    if (!Array.isArray(shop) || shop.length === 0) {
        const shopData = await getDataList('Shop');
        const converted = shopData.map(item => ({
            name: item.name,
            price: num(item.price),
            one: (item.one || []).map(g => ({ name: g.name, 数量: g.数量 }))
        }));
        await writeShop(converted);
        shop = await readShop();
    }
    const index = shop.findIndex(s => isShopItem(s) && s.name === didian);
    if (index === -1) {
        return false;
    }
    const target = shop[index];
    if (!isShopItem(target)) {
        void Send(Text('目标商店数据异常'));
        return false;
    }
    const state = num(target.state);
    if (state === 1) {
        void Send(Text(`${didian}已经戒备森严了,还是不要硬闯好了`));
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    const grade = Math.max(1, num(target.Grade, 1));
    const priceBase = num(target.price, 0);
    const Price = priceBase * grade;
    const buff = grade + 1;
    if (num(player.灵石) < Price) {
        void Send(Text('灵石不足,无法进行强化'));
        return false;
    }
    player.灵石 = num(player.灵石) - Price;
    let msg = `你消费了${Price}灵石,防御力和生命值提高了${Math.trunc((buff - buff / (1 + grade * 0.05)) * 100)}%`;
    player.魔道值 = num(player.魔道值) + 25 * grade;
    await writePlayer(userId, player);
    target.state = 1;
    await writeShop(shop);
    const linggenRaw = player.灵根;
    const linggen = linggenRaw && typeof linggenRaw === 'object' ? linggenRaw : null;
    const faqiu = linggen ? num(linggen['法球倍率'], 0) : 0;
    const pRec = player;
    const playerA = {
        名号: String(pRec['名号'] ?? ''),
        攻击: num(pRec['攻击']),
        防御: Math.floor(num(pRec['防御']) * buff),
        当前血量: Math.floor(num(pRec['血量上限']) * buff),
        暴击率: num(pRec['暴击率']),
        灵根: linggen || {},
        法球倍率: faqiu,
        魔值: num(pRec['魔道值']) > 999 ? 1 : 0
    };
    const timeMin = 15;
    const action_time = timeMin * 60 * 1000;
    const arr = await startAction(userId, '洗劫', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '1',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '0',
        plant: '1',
        mine: '1',
        group_id: e.name === 'message.create' ? e.ChannelId : undefined,
        Place_address: target,
        playerA
    });
    await setValue(userKey(userId, 'action'), arr);
    await setDataByUserId(userId, 'lastxijie_time', now_time);
    msg += `\n开始前往${didian},祝你好运!`;
    void Send(Text(msg));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
