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
import { Go, Read_player, Read_Forum, Write_Forum, convert2integer, exist_najie_thing, Add_najie_thing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)接取.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag)
        return false;
    let time = 0.5;
    let now_time = new Date().getTime();
    let ForumCD = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ForumCD');
    ForumCD = parseInt(ForumCD);
    let transferTimeout = Math.floor(60000 * time);
    if (now_time < ForumCD + transferTimeout) {
        let ForumCDm = Math.trunc((ForumCD + transferTimeout - now_time) / 60 / 1000);
        let ForumCDs = Math.trunc(((ForumCD + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，` +
            `CD: ${ForumCDm}分${ForumCDs}秒`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ForumCD', now_time);
    let player = await Read_player(usr_qq);
    let Forum;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    let t = e.MessageText.replace('#接取', '').split('*');
    let x = (await convert2integer(t[0])) - 1;
    if (x >= Forum.length) {
        return false;
    }
    let thingqq = Forum[x].qq;
    if (thingqq == usr_qq) {
        Send(Text('没事找事做?'));
        return false;
    }
    let thing_name = Forum[x].name;
    let thing_class = Forum[x].class;
    let thing_amount = Forum[x].aconut;
    let thing_price = Forum[x].price;
    let n = await convert2integer(t[1]);
    if (!t[1]) {
        n = thing_amount;
    }
    const num = await exist_najie_thing(usr_qq, thing_name, thing_class);
    if (!num) {
        Send(Text(`你没有【${thing_name}】`));
        return false;
    }
    if (num < n) {
        Send(Text(`你只有【${thing_name}】x ${num}`));
        return false;
    }
    if (n > thing_amount)
        n = thing_amount;
    let money = n * thing_price;
    await Add_najie_thing(usr_qq, thing_name, thing_class, -n);
    await Add___(usr_qq, money);
    await Add_najie_thing(thingqq, thing_name, thing_class, n);
    Forum[x].aconut = Forum[x].aconut - n;
    Forum[x].whole = Forum[x].whole - money;
    Forum = Forum.filter(item => item.aconut > 0);
    await Write_Forum(Forum);
    Send(Text(`${player.名号}在聚宝堂收获了${money}灵石！`));
});

export { res as default, regular, selects };
