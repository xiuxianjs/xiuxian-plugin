import { useSend, Text } from 'alemonjs';
import '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import '../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
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
import 'dayjs';
import 'buffer';
import { readPlayer } from '../../../model/xiuxiandata.js';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import { useLevelUp } from '../Level/level.js';
import mw, { selects } from '../../mw-captcha.js';

const regular = /^(#|＃|\/)?自动突破$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    if (player.level_id > 31 || player.lunhui === 0) {
        return;
    }
    void Send(Text('已为你开启10次自动突破'));
    let num = 1;
    const autoUp = async () => {
        await useLevelUp(e);
        num++;
        if (num > 10) {
            setTimeout(() => {
                void autoUp();
            }, 1000 * 60 * 1);
        }
    };
    setTimeout(() => {
        void autoUp();
    }, 1000 * 60 * 1);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
