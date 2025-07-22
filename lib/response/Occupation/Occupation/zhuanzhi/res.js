import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
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
import { existplayer, Read_player, isNotNull, Write_player } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)猎户转.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.occupation != '猎户') {
        Send(Text('你不是猎户,无法自选职业'));
        return false;
    }
    let occupation = e.MessageText.replace('#猎户转', '');
    let x = data.occupation_list.find(item => item.name == occupation);
    if (!isNotNull(x)) {
        Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    player.occupation = occupation;
    await Write_player(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});

export { res as default, name, regular, selects };
