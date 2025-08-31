import { useSend, Text } from 'alemonjs';
import { getString, setValue, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { readAction, isActionRunning, formatRemaining, remainingMs, startAction, normalizeDurationMinutes } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(采矿$)|(采矿(.*)(分|分钟)$)/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action && +game_action === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    if (player.occupation !== '采矿师') {
        void Send(Text('你挖矿许可证呢？非法挖矿，罚款200灵石'));
        await addCoin(userId, -200);
        return false;
    }
    const timeRaw = e.MessageText.replace(/^(#|＃|\/)?采矿/, '').replace('分钟', '');
    const time = normalizeDurationMinutes(timeRaw, 30, 24, 30);
    const current = await readAction(userId);
    if (isActionRunning(current)) {
        void Send(Text(`正在${current?.action}中，剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const action_time = time * 60 * 1000;
    const arr = await startAction(userId, '采矿', action_time, {
        plant: '1',
        mine: '0',
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await setValue(userKey(userId, 'action'), arr);
    void Send(Text(`现在开始采矿${time}分钟`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
