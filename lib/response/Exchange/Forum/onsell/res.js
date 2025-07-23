import { useSend, Text } from 'alemonjs';
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
import { existplayer, foundthing, convert2integer, Read_Forum, Write_Forum, Read_player, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?发布.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing = e.MessageText.replace('(#|＃|/)?', '');
    thing = thing.replace('发布', '');
    let code = thing.split('*');
    let thing_name = code[0];
    let value = code[1];
    let amount = code[2];
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`这方世界没有[${thing_name}]`));
        return false;
    }
    if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
        Send(Text(`暂不支持该类型物品交易`));
        return false;
    }
    const thing_value = await convert2integer(value);
    const thing_amount = await convert2integer(amount);
    let Forum;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    let now_time = new Date().getTime();
    let whole = Math.trunc(thing_value * thing_amount);
    let off = Math.trunc(whole * 0.03);
    if (off < 100000)
        off = 100000;
    let player = await Read_player(usr_qq);
    if (player.灵石 < off + whole) {
        Send(Text(`灵石不足,还需要${off + whole - player.灵石}灵石`));
        return false;
    }
    await Add___(usr_qq, -(off + whole));
    const wupin = {
        qq: usr_qq,
        name: thing_name,
        price: thing_value,
        class: thing_exist.class,
        aconut: thing_amount,
        whole: whole,
        now_time: now_time
    };
    Forum.push(wupin);
    await Write_Forum(Forum);
    Send(Text('发布成功！'));
});

export { res as default, regular };
