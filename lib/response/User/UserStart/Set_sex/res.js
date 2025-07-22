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
import { existplayer, Read_player } from '../../../../model/xiuxian.js';

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

export { res as default, regular, selects };
