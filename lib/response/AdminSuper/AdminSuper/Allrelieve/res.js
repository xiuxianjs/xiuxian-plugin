import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import '../../../../model/api.js';
import { keysByPath, __PATH, keysAction } from '../../../../model/keys.js';
import { delDataByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import '@alemonjs/db';
import 'dayjs';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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

const regular = /^(#|＃|\/)?解除所有$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return;
    }
    void Send(Text('开始行动！'));
    const playerList = await keysByPath(__PATH.player_path);
    for (const playerId of playerList) {
        void delDataByKey(keysAction.gameAction(playerId));
        void delDataByKey(keysAction.action(playerId));
    }
    void Send(Text('行动结束！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
