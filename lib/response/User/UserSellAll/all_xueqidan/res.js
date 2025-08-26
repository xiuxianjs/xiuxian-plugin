import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addExp2 } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/settions.js';
import '../../../../model/api.js';
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
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(usr_qq));
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
        const qty = num(await existNajieThing(usr_qq, pill.name, category), 0);
        if (qty <= 0) {
            continue;
        }
        const gain = num(pill.xueqi, 0) * qty;
        if (gain > 0) {
            await addNajieThing(usr_qq, pill.name, category, -qty);
            totalGain += gain;
        }
    }
    if (totalGain <= 0) {
        Send(Text('没有可服用的血气丹'));
        return false;
    }
    await addExp2(usr_qq, totalGain);
    Send(Text(`服用成功，血气增加${totalGain}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
