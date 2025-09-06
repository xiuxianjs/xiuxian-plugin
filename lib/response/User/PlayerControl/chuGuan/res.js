import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/api.js';
import { getConfig } from '../../../../model/Config.js';
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
    if (action?.action && action.action === '空闲') {
        void Send(Text('空闲中'));
        return;
    }
    if (action?.shutup !== undefined && +action.shutup !== 0) {
        void Send(Text('不在闭关'));
        return;
    }
    const config = await getConfig('', 'xiuxian');
    const now = Date.now();
    const startTime = action.end_time - action.time;
    const actualCultivationTime = now - startTime;
    const minCultivationTime = 10 * 60 * 1000;
    if (actualCultivationTime < minCultivationTime) {
        const remainingTime = Math.ceil((minCultivationTime - actualCultivationTime) / 60000);
        void Send(Text(`闭关时间不足，需要至少闭关10分钟才能获得收益。还需闭关${remainingTime}分钟。`));
    }
    void handleCultivationSettlement(userId, action, player, config, {
        callback: (msg) => {
            void Send(Text(msg));
        }
    });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
