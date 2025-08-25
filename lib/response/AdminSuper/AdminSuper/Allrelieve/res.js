import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { readAction, stopAction } from '../../../actionHelper.js';
import { userKey } from '../../../../model/utils/redisHelper.js';
import mw, { selects } from '../../../mw.js';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import 'lodash-es';
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
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?解除所有$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return;
    }
    Send(Text('开始行动！'));
    const playerList = await keysByPath(__PATH.player_path);
    for (const player_id of playerList) {
        await redis.del(userKey(player_id, 'game_action'));
        const action = await readAction(player_id);
        if (action) {
            await stopAction(player_id, {
                is_jiesuan: 1,
                shutup: '1',
                working: '1',
                power_up: '1',
                Place_action: '1',
                Place_actionplus: '1'
            });
        }
    }
    Send(Text('行动结束！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
