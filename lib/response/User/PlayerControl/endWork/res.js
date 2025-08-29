import { pushInfo } from '../../../../model/api.js';
import { keysAction, keys } from '../../../../model/keys.js';
import { delDataByKey, getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { getPlayerAction, notUndAndNull } from '../../../../model/common.js';
import { getDataList } from '../../../../model/DataList.js';
import { Mention } from 'alemonjs';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { setFileValue } from '../../../../model/cultivation.js';
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
import { setDataByUserId } from '../../../../model/Redis.js';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?降妖归来$/;
const res = onResponse(selects, async (e) => {
    const rawAction = await getPlayerAction(e.UserId);
    if (!rawAction) {
        return;
    }
    const action = rawAction;
    if (action.action === '空闲') {
        return;
    }
    if (action.working === 1) {
        return false;
    }
    const end_time = action.end_time;
    const start_time = action.end_time - Number(action.time);
    const now_time = Date.now();
    let time;
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const y = cf.work.time;
    const x = cf.work.cycle;
    if (end_time > now_time) {
        time = Math.floor((Date.now() - start_time) / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    else {
        time = Math.floor(Number(action.time) / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    if (e.name === 'message.create' || e.name === 'interaction.create') {
        await dagong_jiesuan(e.UserId, time, false, e.ChannelId);
    }
    else {
        await dagong_jiesuan(e.UserId, time);
    }
    void delDataByKey(keysAction.action(e.UserId));
    await setDataByUserId(e.UserId, 'game_action', 0);
});
var res$1 = onResponse(selects, [mw.current, res.current]);
async function dagong_jiesuan(user_id, time, isRandom, group_id) {
    const userId = user_id;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        return false;
    }
    const LevelList = await getDataList('Level1');
    const now_level_id = LevelList.find(item => item.level_id === player.level_id).level_id;
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const size = cf.work.size;
    const lingshi = Math.floor(size * now_level_id * (1 + player.修炼效率提升) * 0.5);
    let otherLingshi = 0;
    const msg = [Mention(userId)];
    const get_lingshi = Math.trunc(lingshi * time + otherLingshi * 1.5);
    await setFileValue(userId, get_lingshi, '灵石');
    {
        msg.push('\n增加灵石' + get_lingshi);
    }
    if (group_id) {
        pushInfo(group_id, true, msg);
    }
    else {
        pushInfo(userId, false, msg);
    }
    return false;
}

export { res$1 as default, regular };
