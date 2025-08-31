import { useSend, Text } from 'alemonjs';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { readAction, stopAction } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
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
import '../../../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?逃离/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const action = await readAction(userId);
    if (action && (action.Place_action === '0' || action.Place_actionplus === '0' || action.mojie === '0')) {
        await stopAction(userId, {
            is_jiesuan: 1,
            shutup: '1',
            working: '1',
            power_up: '1',
            Place_action: '1',
            Place_actionplus: '1',
            mojie: '1'
        });
        void Send(Text('你已逃离！'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
