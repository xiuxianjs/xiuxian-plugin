import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
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
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?交税\s*\d+$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const MIN_TAX = 1;
const MAX_TAX = 1_000_000_000_000;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?交税/, '').trim();
    if (!raw) {
        void Send(Text('格式: 交税数量 (例: 交税10000)'));
        return false;
    }
    let amount = toInt(convert2integer(raw), 0);
    if (amount < MIN_TAX) {
        void Send(Text(`至少交税 ${MIN_TAX}`));
        return false;
    }
    if (amount > MAX_TAX) {
        amount = MAX_TAX;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('存档异常'));
        return false;
    }
    const lingshi = Number(player.灵石) || 0;
    if (lingshi <= 0) {
        void Send(Text('你身无分文，无需交税'));
        return false;
    }
    if (amount > lingshi) {
        void Send(Text('醒醒，你没有那么多'));
        return false;
    }
    await addCoin(userId, -amount);
    void Send(Text(`成功交税 ${amount} 灵石，剩余 ${lingshi - amount}`));
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
