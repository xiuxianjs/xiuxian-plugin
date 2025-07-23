import { useSend, useMention, Text } from 'alemonjs';
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
import { existplayer, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键赠送(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A_qq = e.UserId;
    let ifexistplay = await existplayer(A_qq);
    if (!ifexistplay)
        return false;
    const [mention] = useMention(e);
    const User = await mention.findOne();
    if (!User) {
        return;
    }
    let B_qq = User.code;
    ifexistplay = await existplayer(B_qq);
    if (!ifexistplay) {
        Send(Text(`此人尚未踏入仙途`));
        return false;
    }
    let A_najie = await data.getData('najie', A_qq);
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
    if (e.MessageText != '#一键赠送') {
        let thing = e.MessageText.replace(/^(#|＃|\/)?一键赠送/, '');
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
        for (let l of A_najie[i]) {
            if (l && l.islockd == 0) {
                let quantity = l.数量;
                if (i == '装备' || i == '仙宠') {
                    await Add_najie_thing(B_qq, l, l.class, quantity, l.pinji);
                    await Add_najie_thing(A_qq, l, l.class, -quantity, l.pinji);
                    continue;
                }
                await Add_najie_thing(A_qq, l.name, l.class, -quantity);
                await Add_najie_thing(B_qq, l.name, l.class, quantity);
            }
        }
    }
    Send(Text(`一键赠送完成`));
});

export { res as default, regular };
