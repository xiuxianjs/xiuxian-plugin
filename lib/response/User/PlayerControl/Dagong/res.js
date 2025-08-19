import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/settions.js';
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
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../route/core/auth.js';
import { selects } from '../../../mw.js';
import { setDataByUserId } from '../../../../model/Redis.js';
import { normalizeDurationMinutes, readAction, isActionRunning, formatRemaining, remainingMs, startAction } from '../../../actionHelper.js';

const regular = /^(#|＃|\/)?(降妖$)|(降妖(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const game_action = await getString(userKey(usr_qq, 'game_action'));
    if (game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '');
    timeStr = timeStr.replace('降妖', '').replace('分', '').replace('钟', '');
    const time = normalizeDurationMinutes(timeStr, 15, 48, 15);
    const player = await readPlayer(usr_qq);
    if (player.当前血量 < 200) {
        Send(Text('你都伤成这样了,先去疗伤吧'));
        return false;
    }
    const current = await readAction(usr_qq);
    if (isActionRunning(current)) {
        Send(Text(`正在${current.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const action_time = time * 60 * 1000;
    const arr = await startAction(usr_qq, '降妖', action_time, {
        plant: '1',
        shutup: '1',
        working: '0',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1'
    });
    await setDataByUserId(usr_qq, 'action', JSON.stringify(arr));
    Send(Text(`现在开始降妖${time}分钟`));
});

export { res as default, regular };
