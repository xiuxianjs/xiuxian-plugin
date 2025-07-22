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
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, exist_najie_thing, Read_player, Add_najie_thing } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)供奉神石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let x = await exist_najie_thing(usr_qq, '神石', '道具');
    if (!x) {
        Send(Text('你没有神石'));
        return false;
    }
    let player = await Read_player(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你尝试供奉神石,但是失败了'));
        return false;
    }
    player.神石 += x;
    await Write_player(usr_qq, player);
    Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'));
    await Add_najie_thing(usr_qq, '神石', '道具', -x);
});

export { res as default, name, regular, selects };
