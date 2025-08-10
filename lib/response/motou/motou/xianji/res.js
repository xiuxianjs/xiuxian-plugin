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
import { existplayer, readPlayer, existNajieThing, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?献祭魔石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
    if (player.魔道值 < 1000) {
        Send(Text('你不是魔头'));
        return false;
    }
    let x = await existNajieThing(usr_qq, '魔石', '道具');
    if (!x) {
        Send(Text('你没有魔石'));
        return false;
    }
    if (x < 8) {
        Send(Text('魔石不足8个,当前魔石数量' + x + '个'));
        return false;
    }
    await addNajieThing(usr_qq, '魔石', '道具', -8);
    let wuping_length;
    let wuping_index;
    let wuping;
    wuping_length = data.xingge[0].one.length;
    wuping_index = Math.trunc(Math.random() * wuping_length);
    wuping = data.xingge[0].one[wuping_index];
    Send(Text('获得了' + wuping.name));
    await addNajieThing(usr_qq, wuping.name, wuping.class, 1);
});

export { res as default, regular };
