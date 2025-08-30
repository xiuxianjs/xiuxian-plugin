import { useSend, Text } from 'alemonjs';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { readAction, isActionRunning, startAction, normalizeBiguanMinutes } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
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
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
        .replace('闭关', '')
        .replace(/[分分钟钟]/g, '')
        .trim();
    const parsed = parseInt(timeStr, 10);
    const time = normalizeBiguanMinutes(Number.isNaN(parsed) ? undefined : parsed);
    const action = await readAction(userId);
    if (isActionRunning(action)) {
        const now = Date.now();
        const rest = action.end_time - now;
        const m = Math.floor(rest / 60000);
        const s = Math.floor((rest - m * 60000) / 1000);
        void Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));
        return false;
    }
    const action_time = time * 60 * 1000;
    await startAction(userId, '闭关', action_time, {
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
