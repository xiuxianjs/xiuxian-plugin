import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Go, readPlayer, readExchange, writeExchange, convert2integer, addNajieThing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?选购.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag)
        return false;
    let time0 = 0.5;
    let now_time = new Date().getTime();
    let Exchange_res = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD');
    const ExchangeCD = parseInt(Exchange_res);
    let transferTimeout = Math.floor(60000 * time0);
    if (now_time < ExchangeCD + transferTimeout) {
        let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
        let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，` +
            `CD: ${ExchangeCDm}分${ExchangeCDs}秒`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time);
    let player = await readPlayer(usr_qq);
    let Exchange;
    try {
        Exchange = await readExchange();
    }
    catch {
        await writeExchange([]);
        Exchange = await readExchange();
    }
    let t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');
    let x = (await convert2integer(t[0])) - 1;
    if (x >= Exchange.length) {
        return false;
    }
    let thingqq = Exchange[x].qq;
    if (thingqq == usr_qq) {
        Send(Text('自己买自己的东西？我看你是闲得蛋疼！'));
        return false;
    }
    let thing_name = Exchange[x].name.name;
    let thing_class = Exchange[x].name.class;
    let thing_amount = Exchange[x].aconut;
    let thing_price = Exchange[x].price;
    let n = await convert2integer(t[1]);
    if (!t[1]) {
        n = thing_amount;
    }
    if (n > thing_amount) {
        Send(Text(`冲水堂没有这么多【${thing_name}】!`));
        return false;
    }
    let money = n * thing_price;
    if (player.灵石 > money) {
        if (thing_class == '装备' || thing_class == '仙宠') {
            await addNajieThing(usr_qq, Exchange[x].name, thing_class, n, Exchange[x].pinji2);
        }
        else {
            await addNajieThing(usr_qq, thing_name, thing_class, n);
        }
        await Add___(usr_qq, -money);
        await Add___(thingqq, money);
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
