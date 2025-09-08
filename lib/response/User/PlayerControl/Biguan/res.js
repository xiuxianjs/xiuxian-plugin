import { useSend, Text } from 'alemonjs';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { isActionRunning, formatRemaining, startAction, normalizeBiguanMinutes } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
import { getPlayerAction } from '../../../../model/common.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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

const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const Send = useSend(e);
    const gameAction = await getString(userKey(userId, 'game_action'));
    if (gameAction && +gameAction === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const action = await getPlayerAction(e.UserId);
    if (isActionRunning(action)) {
        const now = Date.now();
        const remain = action.end_time - now;
        void Send(Text(`正在${action.action}中,剩余时间:${formatRemaining(remain)}`));
        return false;
    }
    if (action?.shutup !== undefined && +action.shutup === 0) {
        void Send(Text('已经在闭关'));
        return;
    }
    if (action?.action && action.action !== '空闲') {
        void Send(Text('不空闲'));
        return;
    }
    const timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
        .replace('闭关', '')
        .replace(/[分分钟钟]/g, '')
        .trim();
    const parsed = parseInt(timeStr, 10);
    const time = normalizeBiguanMinutes(Number.isNaN(parsed) ? undefined : parsed);
    const actionTime = time * 60 * 1000;
    await startAction(userId, '闭关', actionTime, {
        plant: '1',
        shutup: '0',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1'
    });
    void Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
