import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?设置性别.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
    if (player.sex != 0) {
        Send(Text('每个存档仅可设置一次性别！'));
        return;
    }
    let msg = e.MessageText.replace(/^(#|＃|\/)?设置性别/, '');
    if (msg != '男' && msg != '女') {
        Send(Text('请发送#设置性别男 或 #设置性别女'));
        return;
    }
    player.sex = msg == '男' ? 2 : 1;
    await data.setData('player', usr_qq, player);
    Send(Text(`${player.名号}的性别已成功设置为 ${msg}。`));
});

export { res as default, regular };
