import { useSend, Text } from 'alemonjs';
import { getString, userKey, setValue } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { readAction, isActionRunning, formatRemaining, remainingMs, startAction } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
import 'dayjs';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
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
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?堕入魔界$/;
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
    const current = await readAction(userId);
    if (isActionRunning(current)) {
        void Send(Text(`正在${current?.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const player = await readPlayer(userId);
    if (player.魔道值 < 1000) {
        void Send(Text('你不是魔头'));
        return false;
    }
    if (player.修为 < 4000000) {
        void Send(Text('修为不足'));
        return false;
    }
    player.魔道值 -= 100;
    player.修为 -= 4000000;
    await writePlayer(userId, player);
    const time = 60;
    const action_time = time * 60 * 1000;
    const arr = await startAction(userId, '魔界', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '0',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: 10,
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await setValue(userKey(userId, 'action'), arr);
    void Send(Text(`开始进入魔界,${time}分钟后归来!`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
