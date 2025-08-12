import { useSend, Text } from 'alemonjs';
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
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?交税\s*\d+$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const MIN_TAX = 1;
const MAX_TAX = 1_000_000_000_000;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const raw = e.MessageText.replace(/^(#|＃|\/)?交税/, '').trim();
    if (!raw) {
        Send(Text('格式: 交税数量 (例: 交税10000)'));
        return false;
    }
    let amount = toInt(await convert2integer(raw), 0);
    if (amount < MIN_TAX) {
        Send(Text(`至少交税 ${MIN_TAX}`));
        return false;
    }
    if (amount > MAX_TAX)
        amount = MAX_TAX;
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('存档异常'));
        return false;
    }
    const lingshi = Number(player.灵石) || 0;
    if (lingshi <= 0) {
        Send(Text('你身无分文，无需交税'));
        return false;
    }
    if (amount > lingshi) {
        Send(Text('醒醒，你没有那么多'));
        return false;
    }
    await addCoin(usr_qq, -amount);
    Send(Text(`成功交税 ${amount} 灵石，剩余 ${lingshi - amount}`));
    return false;
});

export { res as default, regular };
