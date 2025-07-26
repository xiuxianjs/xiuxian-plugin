import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, readPlayer, existNajieThing, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?参悟神石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你尝试领悟神石,但是失败了'));
        return false;
    }
    let x = await existNajieThing(usr_qq, '神石', '道具');
    if (!x) {
        Send(Text('你没有神石'));
        return false;
    }
    if (x < 8) {
        Send(Text('神石不足8个,当前神石数量' + x + '个'));
        return false;
    }
    await addNajieThing(usr_qq, '神石', '道具', -8);
    let wuping_length;
    let wuping_index;
    let wuping;
    wuping_length = data.timedanyao_list.length;
    wuping_index = Math.trunc(Math.random() * wuping_length);
    wuping = data.timedanyao_list[wuping_index];
    Send(Text('获得了' + wuping.name));
    await addNajieThing(usr_qq, wuping.name, wuping.class, 1);
});

export { res as default, regular };
