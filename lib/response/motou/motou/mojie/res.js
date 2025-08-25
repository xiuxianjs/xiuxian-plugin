import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/settions.js';
import 'lodash-es';
import '../../../../model/api.js';
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
import 'crypto';
import { getString, userKey, setValue } from '../../../../model/utils/redisHelper.js';
import '../../../../route/core/auth.js';
import { readAction, isActionRunning, formatRemaining, remainingMs, startAction } from '../../../actionHelper.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?堕入魔界$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const game_action = await getString(userKey(usr_qq, 'game_action'));
    if (game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const current = await readAction(usr_qq);
    if (isActionRunning(current)) {
        Send(Text(`正在${current?.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (player.魔道值 < 1000) {
        Send(Text('你不是魔头'));
        return false;
    }
    if (player.修为 < 4000000) {
        Send(Text('修为不足'));
        return false;
    }
    player.魔道值 -= 100;
    player.修为 -= 4000000;
    await writePlayer(usr_qq, player);
    const time = 60;
    const action_time = time * 60 * 1000;
    const arr = await startAction(usr_qq, '魔界', action_time, {
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
        group_id: e.name == 'message.create' ? e.ChannelId : undefined
    });
    await setValue(userKey(usr_qq, 'action'), arr);
    Send(Text(`开始进入魔界,${time}分钟后归来!`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
