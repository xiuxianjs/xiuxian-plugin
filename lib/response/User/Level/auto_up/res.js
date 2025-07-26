import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Level_up } from '../level.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?自动突破$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
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

export { res as default, regular };
