import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';

const regular = /^(#|＃|\/)?修仙世界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    const num = [0, 0, 0, 0];
    for (const player_id of playerList) {
        const usr_qq = player_id;
        const player = await await data.getData('player', usr_qq);
        if (player.魔道值 > 999)
            num[3]++;
        else if ((player.lunhui > 0 || player.level_id > 41) && player.魔道值 < 1)
            num[0]++;
        else if (player.lunhui > 0 || player.level_id > 41)
            num[1]++;
        else
            num[2]++;
    }
    const n = num[0] + num[1] + num[2];
    const msg = '___[修仙世界]___' +
        '\n人数：' +
        n +
        '\n神人：' +
        num[0] +
        '\n仙人：' +
        num[1] +
        '\n凡人：' +
        num[2] +
        '\n魔头：' +
        num[3];
    Send(Text(msg));
});

export { res as default, regular };
