import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, foundthing, readNajie, addNajieThing, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?回收.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing_name = e.MessageText.replace(/^(#|＃|\/)?回收/, '');
    thing_name = thing_name.trim();
    let thing_exist = await foundthing(thing_name);
    if (thing_exist) {
        Send(Text(`${thing_name}可以使用,不需要回收`));
        return false;
    }
    let lingshi = 0;
    let najie = await readNajie(usr_qq);
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
            await addNajieThing(usr_qq, thing.name, thing.class, -thing.数量, thing.pinji);
        }
    }
    await addCoin(usr_qq, lingshi);
    Send(Text(`回收成功,获得${lingshi}灵石`));
});

export { res as default, regular };
