import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, Read_Exchange, Write_Exchange, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?下架[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let time0 = 0.5;
    let now_time = new Date().getTime();
    let ExchangeCD = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD');
    ExchangeCD = parseInt(ExchangeCD);
    let transferTimeout = Math.floor(60000 * time0);
    if (now_time < ExchangeCD + transferTimeout) {
        let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
        let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，` +
            `CD: ${ExchangeCDm}分${ExchangeCDs}秒`));
        return false;
    }
    let Exchange;
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time);
    let player = await Read_player(usr_qq);
    let x = parseInt(e.MessageText.replace('(#|＃|/)?下架', '')) - 1;
    try {
        Exchange = await Read_Exchange();
    }
    catch {
        await Write_Exchange([]);
        Exchange = await Read_Exchange();
    }
    if (x >= Exchange.length) {
        Send(Text(`没有编号为${x + 1}的物品`));
        return false;
    }
    let thingqq = Exchange[x].qq;
    if (thingqq != usr_qq) {
        Send(Text('不能下架别人上架的物品'));
        return false;
    }
    let thing_name = Exchange[x].name.name;
    let thing_class = Exchange[x].name.class;
    let thing_amount = Exchange[x].aconut;
    if (thing_class == '装备' || thing_class == '仙宠') {
        await Add_najie_thing(usr_qq, Exchange[x].name, thing_class, thing_amount, Exchange[x].pinji2);
    }
    else {
        await Add_najie_thing(usr_qq, thing_name, thing_class, thing_amount);
    }
    Exchange.splice(x, 1);
    await Write_Exchange(Exchange);
    await redis.set('xiuxian@1.3.0:' + thingqq + ':Exchange', 0);
    Send(Text(player.名号 + '下架' + thing_name + '成功！'));
    return false;
});

export { res as default, regular };
