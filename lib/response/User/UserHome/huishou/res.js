import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { existplayer, foundthing, Read_najie, Add_najie_thing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)回收.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing_name = e.MessageText.replace('#回收', '');
    thing_name = thing_name.trim();
    let thing_exist = await foundthing(thing_name);
    if (thing_exist) {
        Send(Text(`${thing_name}可以使用,不需要回收`));
        return false;
    }
    let lingshi = 0;
    let najie = await Read_najie(usr_qq);
    let type = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
    ];
    for (let i of type) {
        let thing = najie[i].find(item => item.name == thing_name);
        if (thing) {
            if (thing.class == '材料' || thing.class == '草药') {
                lingshi += thing.出售价 * thing.数量;
            }
            else {
                lingshi += thing.出售价 * 2 * thing.数量;
            }
            await Add_najie_thing(usr_qq, thing.name, thing.class, -thing.数量, thing.pinji);
        }
    }
    await Add___(usr_qq, lingshi);
    Send(Text(`回收成功,获得${lingshi}灵石`));
});

export { res as default, name, regular, selects };
