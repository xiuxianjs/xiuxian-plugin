import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?选购.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag)
        return false;
    const time0 = 0.5;
    const now_time = Date.now();
    const Exchange_res = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD');
    const ExchangeCD = parseInt(Exchange_res);
    const transferTimeout = Math.floor(60000 * time0);
    if (now_time < ExchangeCD + transferTimeout) {
        const ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
        const ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，` +
            `CD: ${ExchangeCDm}分${ExchangeCDs}秒`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time);
    const player = await readPlayer(usr_qq);
    let Exchange = [];
    try {
        Exchange = await readExchange();
    }
    catch {
        await writeExchange([]);
    }
    const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');
    const x = (await convert2integer(t[0])) - 1;
    if (x >= Exchange.length) {
        return false;
    }
    const thingqq = Exchange[x].qq;
    if (thingqq == usr_qq) {
        Send(Text('自己买自己的东西？我看你是闲得蛋疼！'));
        return false;
    }
    const thing_name = Exchange[x].thing.name;
    const thing_class = Exchange[x].thing.class;
    const thing_amount = Exchange[x].amount;
    const thing_price = Exchange[x].price;
    let n = await convert2integer(t[1]);
    if (!t[1]) {
        n = thing_amount;
    }
    if (n > thing_amount) {
        Send(Text(`冲水堂没有这么多【${thing_name}】!`));
        return false;
    }
    const money = n * thing_price;
    if (player.灵石 > money) {
        if (thing_class == '装备' || thing_class == '仙宠') {
            await addNajieThing(usr_qq, Exchange[x].name, thing_class, n, Exchange[x].pinji2);
        }
        else {
            await addNajieThing(usr_qq, thing_name, thing_class, n);
        }
        await addCoin(usr_qq, -money);
        await addCoin(thingqq, money);
        Exchange[x].aconut = Exchange[x].aconut - n;
        Exchange[x].whole = Exchange[x].whole - money;
        Exchange = Exchange.filter(item => item.aconut > 0);
        await writeExchange(Exchange);
        Send(Text(`${player.名号}在冲水堂购买了${n}个【${thing_name}】！`));
    }
    else {
        Send(Text('醒醒，你没有那么多钱！'));
        return false;
    }
});

export { res as default, regular };
