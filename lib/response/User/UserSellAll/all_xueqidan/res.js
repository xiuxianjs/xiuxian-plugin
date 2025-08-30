import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { addExp2 } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
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
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?一键服用血气丹$/;
function num(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
}
function normalizeCategory(v) {
    return String(v);
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie) {
        return;
    }
    const pills = Array.isArray(najie?.丹药) ? najie.丹药 : [];
    if (!pills.length) {
        void Send(Text('纳戒内没有丹药'));
        return false;
    }
    let totalGain = 0;
    for (const pill of pills) {
        if (!pill || pill.type !== '血气') {
            continue;
        }
        const category = normalizeCategory(pill.class);
        const qty = num(await existNajieThing(userId, pill.name, category), 0);
        if (qty <= 0) {
            continue;
        }
        const gain = num(pill.xueqi, 0) * qty;
        if (gain > 0) {
            await addNajieThing(userId, pill.name, category, -qty);
            totalGain += gain;
        }
    }
    if (totalGain <= 0) {
        void Send(Text('没有可服用的血气丹'));
        return false;
    }
    await addExp2(userId, totalGain);
    void Send(Text(`服用成功，血气增加${totalGain}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
