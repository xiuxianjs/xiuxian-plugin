import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, foundthing, Add_najie_thing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)一键回收(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await data.getData('najie', usr_qq);
    let lingshi = 0;
    let wupin = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
    ];
    let wupin1 = [];
    if (e.MessageText != '#一键回收') {
        let thing = e.MessageText.replace('#一键回收', '');
        for (let i of wupin) {
            if (thing == i) {
                wupin1.push(i);
                thing = thing.replace(i, '');
            }
        }
        if (thing.length == 0) {
            wupin = wupin1;
        }
        else {
            return false;
        }
    }
    for (let i of wupin) {
        for (let l of najie[i]) {
            let thing_exist = await foundthing(l.name);
            if (thing_exist) {
                continue;
            }
            await Add_najie_thing(usr_qq, l.name, l.class, -l.数量, l.pinji);
            if (l.class == '材料' || l.class == '草药') {
                lingshi += l.出售价 * l.数量;
            }
            else {
                lingshi += l.出售价 * l.数量 * 2;
            }
        }
    }
    await Add___(usr_qq, lingshi);
    Send(Text(`回收成功!  获得${lingshi}灵石 `));
});

export { res as default, regular, selects };
