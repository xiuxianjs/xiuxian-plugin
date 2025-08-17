import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import data from '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { addExp } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键服用修为丹$/;
function num(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
}
function normalizeCategory(v) {
    return String(v);
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const najie = (await data.getData('najie', usr_qq));
    const pills = Array.isArray(najie?.丹药) ? najie.丹药 : [];
    if (!pills.length) {
        Send(Text('纳戒内没有丹药'));
        return false;
    }
    let totalExp = 0;
    for (const pill of pills) {
        if (!pill || pill.type !== '修为')
            continue;
        const category = normalizeCategory(pill.class);
        const qty = num(await existNajieThing(usr_qq, pill.name, category), 0);
        if (qty <= 0)
            continue;
        const gain = num(pill.exp, 0) * qty;
        if (gain > 0) {
            await addNajieThing(usr_qq, pill.name, category, -qty);
            totalExp += gain;
        }
    }
    if (totalExp <= 0) {
        Send(Text('没有可服用的修为丹'));
        return false;
    }
    await addExp(usr_qq, totalExp);
    Send(Text(`服用成功，修为增加${totalExp}`));
    return false;
});

export { res as default, regular };
