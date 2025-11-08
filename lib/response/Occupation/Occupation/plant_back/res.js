import '../../../../model/api.js';
import { keysAction } from '../../../../model/keys.js';
import { setDataJSONStringifyByKey, delDataByKey } from '../../../../model/DataControl.js';
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
import '@alemonjs/db';
import 'alemonjs';
import { getPlayerAction } from '../../../../model/common.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { calcEffectiveMinutes, plantJiesuan } from '../../../../model/actions/occupation.js';
import { withLock } from '../../../../model/locks.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?结束采药$/;
const res = onResponse(selects, async (e) => {
    const lockKey = `plant_settlement_${e.UserId}`;
    const result = await withLock(lockKey, async () => {
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
            await plantJiesuan(e.UserId, effective, e.ChannelId);
        }
        else {
            await plantJiesuan(e.UserId, effective);
        }
        const updatedAction = { ...raw, is_jiesuan: 1 };
        await setDataJSONStringifyByKey(keysAction.action(e.UserId), updatedAction);
        setTimeout(() => {
            void delDataByKey(keysAction.action(e.UserId));
        }, 1000);
    }, { timeout: 5000, maxRetries: 0 });
    if (!result.success) {
        return false;
    }
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
