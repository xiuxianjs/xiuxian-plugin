import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { sleep } from '../../../../model/common.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { findQinmidu } from '../../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?查询亲密度$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const A = e.UserId;
    let flag = 0;
    const msg = [];
    msg.push('\n-----qq----- -亲密度-');
    const playerList = await keysByPath(__PATH.player_path);
    for (let i = 0; i < playerList.length; i++) {
        const B = playerList[i];
        if (A === B) {
            continue;
        }
        const pd = await findQinmidu(A, B);
        if (pd === false) {
            continue;
        }
        flag++;
        msg.push(`\n${B}\t ${pd}`);
    }
    if (flag === 0) {
        void Send(Text('其实一个人也不错的'));
    }
    else {
        for (let i = 0; i < msg.length; i += 8) {
            void Send(Text(msg.slice(i, i + 8).join('')));
            await sleep(500);
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
