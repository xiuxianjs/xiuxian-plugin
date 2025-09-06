import '../../../../model/api.js';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { getPlayerAction } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
import { useSend, Text } from 'alemonjs';
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
import mw, { selects } from '../../../mw.js';
import { handleCultivationSettlement } from '../../../../model/actions/PlayerControlTask.js';

const regular = /^(#|＃|\/)?出关$/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const Send = useSend(e);
    const gameAction = await getString(userKey(userId, 'game_action'));
    if (gameAction && +gameAction === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const action = await getPlayerAction(e.UserId);
    if (!action) {
        void Send(Text('空闲中'));
        return;
    }
    if (action?.shutup !== undefined && +action.shutup === 1) {
        void Send(Text('不空闲'));
        return;
    }
    if (action?.action && action.action === '空闲') {
        void Send(Text('空闲中'));
        return;
    }
    void handleCultivationSettlement(userId, action, player, config, {
        callback: (msg) => {
            void Send(Text(msg));
        }
    });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
