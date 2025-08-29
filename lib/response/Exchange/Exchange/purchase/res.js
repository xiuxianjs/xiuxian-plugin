import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
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
import { readExchange, writeExchange } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?选购.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const time0 = 0.5;
    const now_time = Date.now();
    const res = await redis.get(getRedisKey(userId, 'ExchangeCD'));
    if (!res) {
        return;
    }
    const ExchangeCD = parseInt(res);
    const transferTimeout = Math.floor(60000 * time0);
    if (now_time < ExchangeCD + transferTimeout) {
        const ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
        const ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
        void Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，CD: ${ExchangeCDm}分${ExchangeCDs}秒`));
        return false;
    }
    await redis.set(getRedisKey(userId, 'ExchangeCD'), String(now_time));
    const player = await readPlayer(userId);
    let Exchange = await readExchange();
    const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');
    if (!/^[1-9]\d*$/.test(t[0])) {
        void Send(Text(`请输入正确的编号,${t[0]}不是合法的数字`));
        return false;
    }
    if (!/^[1-9]\d*$/.test(t[1])) {
        void Send(Text(`请输入正确的数量,${t[1]}不是合法的数字`));
        return false;
    }
    const x = convert2integer(t[0]) - 1;
    if (x >= Exchange.length) {
        return false;
    }
    const thingqq = Exchange[x].qq;
    if (thingqq === userId) {
        void Send(Text('自己买自己的东西？我看你是闲得蛋疼！'));
        return false;
    }
    const thingName = Exchange[x].thing.name;
    const thingClass = Exchange[x].thing.class;
    const thingCount = Exchange[x].amount;
    const thingPrice = Exchange[x].price;
    let n = convert2integer(t[1]);
    if (!t[1]) {
        n = thingCount;
    }
    if (n > thingCount) {
        void Send(Text(`冲水堂没有这么多【${thingName}】!`));
        return false;
    }
    const money = n * thingPrice;
    if (player.灵石 > money) {
        if (thingClass === '装备' || thingClass === '仙宠') {
            await addNajieThing(userId, Exchange[x].thing.name, thingClass, n, Exchange[x].pinji2);
        }
        else {
            await addNajieThing(userId, thingName, thingClass, n);
        }
        await addCoin(userId, -money);
        await addCoin(thingqq, money);
        Exchange[x].amount = Exchange[x].amount - n;
        Exchange = Exchange.filter(item => item.amount > 0);
        await writeExchange(Exchange);
        void Send(Text(`${player.名号}在冲水堂购买了${n}个【${thingName}】！`));
    }
    else {
        void Send(Text('醒醒，你没有那么多钱！'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
