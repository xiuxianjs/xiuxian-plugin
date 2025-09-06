import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { useLevelUp, userLevelMaxUp } from '../level.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?自动(突破|破体)$/;
const timeout = {};
const autoBreakthroughStatus = {};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player || player.level_id > 31 || player.level_id === 0) {
        return false;
    }
    if (autoBreakthroughStatus[userId]) {
        void Send(Text('自动升级境界已在进行中，请勿重复使用'));
        return false;
    }
    const isBreakthrough = /突破/.test(e.MessageText);
    if (timeout[userId]) {
        clearTimeout(timeout[userId]);
    }
    void Send(Text('已为你开启10次自动升级境界'));
    autoBreakthroughStatus[userId] = true;
    let num = 1;
    const performAutoBreakthrough = () => {
        if (num > 10) {
            autoBreakthroughStatus[userId] = false;
            if (timeout[userId]) {
                clearTimeout(timeout[userId]);
            }
            return;
        }
        if (isBreakthrough) {
            void useLevelUp(e);
        }
        else {
            void userLevelMaxUp(e, false);
        }
        num++;
        if (num <= 10) {
            timeout[userId] = setTimeout(performAutoBreakthrough, 185000);
        }
        else {
            autoBreakthroughStatus[userId] = false;
            if (timeout[userId]) {
                clearTimeout(timeout[userId]);
            }
        }
    };
    timeout[userId] = setTimeout(performAutoBreakthrough, 185000);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
