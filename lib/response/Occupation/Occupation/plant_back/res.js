import { keysAction } from '../../../../model/keys.js';
import { delDataByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import 'alemonjs';
import { getPlayerAction } from '../../../../model/common.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { calcEffectiveMinutes, plant_jiesuan } from '../../api.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?结束采药$/;
const res = onResponse(selects, async (e) => {
    const raw = await getPlayerAction(e.UserId);
    if (!raw) {
        return;
    }
    if (raw.action === '空闲') {
        return;
    }
    if (raw.plant === '1') {
        return;
    }
    if (raw.is_jiesuan === 1) {
        return;
    }
    const start_time = raw.end_time - raw.time;
    const now = Date.now();
    const effective = calcEffectiveMinutes(start_time, raw.end_time, now);
    if (e.name === 'message.create') {
        await plant_jiesuan(e.UserId, effective, e.ChannelId);
    }
    else {
        await plant_jiesuan(e.UserId, effective);
    }
    void delDataByKey(keysAction.action(e.UserId));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
