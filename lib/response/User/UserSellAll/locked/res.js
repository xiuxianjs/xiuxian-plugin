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
import { existplayer, Read_najie, foundthing, re_najie_thing } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)(锁定|解锁).*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let msg = e.MessageText.replace('#', '');
    let un_lock = msg.substring(0, 2);
    let thing = msg.substring(2).split('*');
    let thing_name = thing[0];
    let najie = await Read_najie(usr_qq);
    thing[0] = parseInt(thing[0]);
    let thing_pinji;
    if (thing[0]) {
        if (thing[0] > 1000) {
            try {
                thing_name = najie.仙宠[thing[0] - 1001].name;
            }
            catch {
                Send(Text('仙宠代号输入有误!'));
                return false;
            }
        }
        else if (thing[0] > 100) {
            try {
                thing_name = najie.装备[thing[0] - 101].name;
                thing[1] = najie.装备[thing[0] - 101].pinji;
            }
            catch {
                Send(Text('装备代号输入有误!'));
                return false;
            }
        }
    }
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`你瓦特了吧，这方世界没有这样的东西:${thing_name}`));
        return false;
    }
    let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
    thing_pinji = pj[thing[1]];
    let ifexist;
    if (un_lock == '锁定') {
        ifexist = await re_najie_thing(usr_qq, thing_name, thing_exist.class, thing_pinji, 1);
        if (ifexist) {
            Send(Text(`${thing_exist.class}:${thing_name}已锁定`));
            return false;
        }
    }
    else if (un_lock == '解锁') {
        ifexist = await re_najie_thing(usr_qq, thing_name, thing_exist.class, thing_pinji, 0);
        if (ifexist) {
            Send(Text(`${thing_exist.class}:${thing_name}已解锁`));
            return false;
        }
    }
    Send(Text(`你没有【${thing_name}】这样的${thing_exist.class}`));
});

export { res as default, regular, selects };
