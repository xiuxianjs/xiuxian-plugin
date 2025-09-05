import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { existplayer, readPlayer, readNajie } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { addBagCoin } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(存|取)灵石(.*)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const reg = new RegExp(/取|存/);
    const func = reg.exec(e.MessageText)[0];
    let msg = e.MessageText.replace(reg, '');
    msg = msg.replace(/^(#|＃|\/)?/, '');
    let lingshi = msg.replace('灵石', '').trim();
    if (func === '存' && lingshi === '全部') {
        const P = await readPlayer(userId);
        lingshi = P.灵石;
    }
    if (func === '取' && lingshi === '全部') {
        const N = await readNajie(userId);
        lingshi = N.灵石;
    }
    if (typeof lingshi !== 'number') {
        lingshi = convert2integer(lingshi);
    }
    if (func === '存') {
        const playerInfo = await readPlayer(userId);
        const player_lingshi = playerInfo.灵石;
        if (player_lingshi < lingshi) {
            void Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`));
            return false;
        }
        const najie = await readNajie(userId);
        if (najie.灵石上限 < najie.灵石 + lingshi) {
            await addBagCoin(userId, najie.灵石上限 - najie.灵石);
            await addCoin(userId, -najie.灵石上限 + najie.灵石);
            void Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`));
            return false;
        }
        await addBagCoin(userId, lingshi);
        await addCoin(userId, -lingshi);
        void Send(Text(`储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${najie.灵石 + lingshi}灵石`));
        return false;
    }
    if (func === '取') {
        const najie = await readNajie(userId);
        if (najie.灵石 < lingshi) {
            void Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`));
            return false;
        }
        await addBagCoin(userId, -lingshi);
        await addCoin(userId, lingshi);
        void Send(Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
