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
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';
import { Level_up } from '../level.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)自动突破$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.level_id > 31 || player.lunhui == 0)
        return false;
    Send(Text('已为你开启10次自动突破'));
    let num = 1;
    let time = setInterval(() => {
        Level_up(e);
        num++;
        if (num > 10)
            clearInterval(time);
    }, 185000);
    return false;
});

export { res as default, name, regular, selects };
