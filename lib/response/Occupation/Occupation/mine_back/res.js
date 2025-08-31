import '../../../../model/api.js';
import { keysAction } from '../../../../model/keys.js';
import { delDataByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'alemonjs';
import { getPlayerAction } from '../../../../model/common.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { mine_jiesuan } from '../../../../model/actions/occupation.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?结束采矿$/;
const BLOCK_MINUTES = 30;
const MAX_BLOCKS = 24;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function normalizeAction(raw) {
    if (!raw || typeof raw !== 'object') {
        return { action: '空闲' };
    }
    const r = raw;
    const action = {
        action: typeof r.action === 'string' ? r.action : '空闲',
        mine: toInt(r.mine),
        end_time: toInt(r.end_time),
        time: toInt(r.time),
        start: toInt(r.start),
        duration: toInt(r.duration),
        is_jiesuan: toInt(r.is_jiesuan),
        plant: toInt(r.plant),
        shutup: toInt(r.shutup),
        working: toInt(r.working),
        power_up: toInt(r.power_up),
        Place_action: toInt(r.Place_action),
        group_id: typeof r.group_id === 'string' ? r.group_id : undefined
    };
    if (!action.end_time) {
        delete action.end_time;
    }
    if (!action.time) {
        delete action.time;
    }
    if (!action.start) {
        delete action.start;
    }
    if (!action.duration) {
        delete action.duration;
    }
    return action;
}
function calcEffectiveMinutes(act, now) {
    let startMs;
    let durationMs;
    if (act.end_time && act.time) {
        durationMs = act.time;
        startMs = act.end_time - act.time;
    }
    else if (act.start && act.duration) {
        startMs = act.start;
        durationMs = act.duration;
    }
    if (!startMs || !durationMs) {
        return 0;
    }
    const endMs = startMs + durationMs;
    const elapsed = endMs > now ? Math.max(0, now - startMs) : durationMs;
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < BLOCK_MINUTES) {
        return 0;
    }
    const blocks = Math.min(MAX_BLOCKS, Math.floor(minutes / BLOCK_MINUTES));
    return blocks * BLOCK_MINUTES;
}
const res = onResponse(selects, async (e) => {
    const raw = await getPlayerAction(e.UserId);
    const action = normalizeAction(raw);
    if (action.action === '空闲') {
        return false;
    }
    if (action.mine === 1) {
        return false;
    }
    const now = Date.now();
    const minutes = calcEffectiveMinutes(action, now);
    if (e.name === 'message.create') {
        await mine_jiesuan(e.UserId, minutes, e.ChannelId);
    }
    else {
        await mine_jiesuan(e.UserId, minutes);
    }
    void delDataByKey(keysAction.action(e.UserId));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
