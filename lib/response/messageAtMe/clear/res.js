import '../../../model/api.js';
import { keys } from '../../../model/keys.js';
import { getIoRedis } from '@alemonjs/db';
import '../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { useMessage, Text } from 'alemonjs';
import { existplayer } from '../../../model/xiuxiandata.js';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import mw, { selects } from '../../mw-captcha.js';

const regular = /^(#|＃|\/)?清理消息/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const [message] = useMessage(e);
    if (!message) {
        return;
    }
    const redis = getIoRedis();
    const id = String(e.UserId);
    void redis.del(keys.proactiveMessageLog(id));
    void message.send(format(Text('消息记录已清理')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
