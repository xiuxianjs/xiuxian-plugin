import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import { getPlayerAction } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'alemonjs';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
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
    await redis.set(`xiuxian@1.3.0:${e.UserId}:action`, JSON.stringify(action));
    return false;
});

export { res as default, regular };
