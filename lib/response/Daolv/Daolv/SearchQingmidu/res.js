import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { sleep } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { findQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?查询亲密度$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = e.UserId;
    let flag = 0;
    const msg = [];
    msg.push(`\n-----qq----- -亲密度-`);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let i = 0; i < playerList.length; i++) {
        const B = playerList[i];
        if (A == B) {
            continue;
        }
        const pd = await findQinmidu(A, B);
        if (pd == false) {
            continue;
        }
        flag++;
        msg.push(`\n${B}\t ${pd}`);
    }
    if (flag == 0) {
        Send(Text(`其实一个人也不错的`));
    }
    else {
        for (let i = 0; i < msg.length; i += 8) {
            Send(Text(msg.slice(i, i + 8).join('')));
            await sleep(500);
        }
    }
});

export { res as default, regular };
