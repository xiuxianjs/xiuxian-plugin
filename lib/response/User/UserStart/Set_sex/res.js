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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)设置性别.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.sex != 0) {
        Send(Text('每个存档仅可设置一次性别！'));
        return;
    }
    let msg = e.MessageText.replace('#设置性别', '');
    if (msg != '男' && msg != '女') {
        Send(Text('请发送#设置性别男 或 #设置性别女'));
        return;
    }
    player.sex = msg == '男' ? 2 : 1;
    await data.setData('player', usr_qq, player);
    Send(Text(`${player.名号}的性别已成功设置为 ${msg}。`));
});

export { res as default, name, regular, selects };
