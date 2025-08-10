import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, Write_najie } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键锁定(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await await data.getData('najie', usr_qq);
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
    if (e.MessageText != '#一键锁定') {
        let thing = e.MessageText.replace(/^(#|＃|\/)?一键锁定/, '');
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
            l.islockd = 1;
        }
    }
    await Write_najie(usr_qq, najie);
    Send(Text(`一键锁定完成`));
});

export { res as default, regular };
