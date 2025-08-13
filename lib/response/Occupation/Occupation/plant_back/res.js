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
import '../../../../model/danyao.js';
import { getPlayerAction } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'alemonjs';
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
import 'crypto';
import { plant_jiesuan } from '../../api.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?结束采药$/;
function calcEffectiveMinutes(start, end, now, slot = 15, maxSlots = 48) {
    let minutes;
    if (end > now) {
        minutes = Math.floor((now - start) / 60000);
    }
    else {
        minutes = Math.floor((end - start) / 60000);
    }
    if (minutes < slot)
        return 0;
    const full = Math.min(Math.floor(minutes / slot), maxSlots);
    return full * slot;
}
var res = onResponse(selects, async (e) => {
    const raw = (await getPlayerAction(e.UserId));
    if (!raw)
        return false;
    if (raw.action === '空闲')
        return false;
    if (raw.is_jiesuan === 1)
        return false;
    const start_time = raw.end_time - raw.time;
    const now = Date.now();
    const effective = calcEffectiveMinutes(start_time, raw.end_time, now);
    if (e.name === 'message.create')
        await plant_jiesuan(e.UserId, effective, e.ChannelId);
    else
        await plant_jiesuan(e.UserId, effective);
    const next = { ...raw };
    next.is_jiesuan = 1;
    next.plant = 1;
    next.shutup = 1;
    next.working = 1;
    next.power_up = 1;
    next.Place_action = 1;
    next.end_time = Date.now();
    delete next.group_id;
    await redis.set(`xiuxian@1.3.0:${e.UserId}:action`, JSON.stringify(next));
    return false;
});

export { res as default, regular };
