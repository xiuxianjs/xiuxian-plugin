import { getRedisKey } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?清空赏金榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    let action = await redis.get(getRedisKey('1', 'shangjing'));
    action = await JSON.parse(action);
    action = null;
    void Send(Text('清除完成'));
    await redis.set(getRedisKey('1', 'shangjing'), JSON.stringify(action));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
