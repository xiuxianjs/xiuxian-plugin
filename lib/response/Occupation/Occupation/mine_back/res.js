import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import 'alemonjs';
import '../../../../model/DataList.js';
import '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import { getPlayerAction } from '../../../../model/common.js';
import 'lodash-es';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { mine_jiesuan } from '../../api.js';
import { selects } from '../../../index.js';

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
        mine: toInt(r.mine, undefined),
        end_time: toInt(r.end_time, undefined),
        time: toInt(r.time, undefined),
        start: toInt(r.start, undefined),
        duration: toInt(r.duration, undefined),
        is_jiesuan: toInt(r.is_jiesuan, undefined),
        plant: toInt(r.plant, undefined),
        shutup: toInt(r.shutup, undefined),
        working: toInt(r.working, undefined),
        power_up: toInt(r.power_up, undefined),
        Place_action: toInt(r.Place_action, undefined),
        group_id: typeof r.group_id === 'string' ? r.group_id : undefined
    };
    if (!action.end_time)
        delete action.end_time;
    if (!action.time)
        delete action.time;
    if (!action.start)
        delete action.start;
    if (!action.duration)
        delete action.duration;
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
    if (!startMs || !durationMs)
        return 0;
    const endMs = startMs + durationMs;
    const elapsed = endMs > now ? Math.max(0, now - startMs) : durationMs;
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < BLOCK_MINUTES)
        return 0;
    const blocks = Math.min(MAX_BLOCKS, Math.floor(minutes / BLOCK_MINUTES));
    return blocks * BLOCK_MINUTES;
}
var res = onResponse(selects, async (e) => {
    const raw = await getPlayerAction(e.UserId);
    const action = normalizeAction(raw);
    if (action.action === '空闲')
        return false;
    if (action.mine === 1)
        return false;
    const now = Date.now();
    const minutes = calcEffectiveMinutes(action, now);
    if (e.name === 'message.create') {
        await mine_jiesuan(e.UserId, minutes, e.ChannelId);
    }
    else {
        await mine_jiesuan(e.UserId, minutes);
    }
    action.is_jiesuan = 1;
    action.mine = 1;
    action.plant = 1;
    action.shutup = 1;
    action.working = 1;
    action.power_up = 1;
    action.Place_action = 1;
    action.end_time = now;
    action.time =
        (action.time && action.end_time && action.time) ||
            action.duration ||
            minutes * 60000;
    delete action.group_id;
    redis.set(getRedisKey(e.UserId, 'action'), JSON.stringify(action));
    return false;
});

export { res as default, regular };
