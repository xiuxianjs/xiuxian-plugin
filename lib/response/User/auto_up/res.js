import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../model/xiuxian_impl.js';
import '../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../model/settions.js';
import '../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../../../route/core/auth.js';
import { Level_up } from '../Level/level.js';
import { selects } from '../../index.js';

const regular = /^(#|＃|\/)?自动突破$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (player.level_id > 31 || player.lunhui == 0)
        return false;
    Send(Text('已为你开启10次自动突破'));
    let num = 1;
    const timer = setInterval(() => {
        Level_up(e);
        num++;
        if (num > 10)
            clearInterval(timer);
    }, 185000);
    return false;
});

export { res as default, regular };
