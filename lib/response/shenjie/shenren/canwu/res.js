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
import { existplayer, Read_player, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?参悟神石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你尝试领悟神石,但是失败了'));
        return false;
    }
    let x = await exist_najie_thing(usr_qq, '神石', '道具');
    if (!x) {
        Send(Text('你没有神石'));
        return false;
    }
    if (x < 8) {
        Send(Text('神石不足8个,当前神石数量' + x + '个'));
        return false;
    }
    await Add_najie_thing(usr_qq, '神石', '道具', -8);
    let wuping_length;
    let wuping_index;
    let wuping;
    wuping_length = data.timedanyao_list.length;
    wuping_index = Math.trunc(Math.random() * wuping_length);
    wuping = data.timedanyao_list[wuping_index];
    Send(Text('获得了' + wuping.name));
    await Add_najie_thing(usr_qq, wuping.name, wuping.class, 1);
});

export { res as default, regular };
