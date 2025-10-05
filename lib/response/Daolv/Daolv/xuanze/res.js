import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { readQinmidu, writeQinmidu } from '../../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { Daolv, found } from '../daolv.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?^(我愿意|我拒绝)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.UserId !== Daolv.user_B) {
        return false;
    }
    if (Daolv.x === 1) {
        const player_B = await readPlayer(Daolv.user_B);
        if (e.MessageText === '我愿意') {
            const qinmidu = await readQinmidu();
            const i = await found(Daolv.user_A, Daolv.user_B);
            if (i !== qinmidu.length) {
                qinmidu[i].婚姻 = 1;
                await writeQinmidu(qinmidu);
                void Send(Text(`${player_B.名号}同意了你的请求`));
                await addNajieThing(Daolv.user_A, '定情信物', '道具', -1);
            }
        }
        else if (e.MessageText === '我拒绝') {
            void Send(Text(`${player_B.名号}拒绝了你的请求`));
        }
        clearTimeout(Daolv.chaoshi_time);
        Daolv.set_chaoshi_time(null);
        Daolv.set_x(0);
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
