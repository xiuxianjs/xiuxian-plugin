import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addCoin } from '../../../../model/economy.js';
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

const regular = /^(#|＃|\/)?打开钱包$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(usr_qq));
    if (!player) {
        return;
    }
    const thing_name = '水脚脚的钱包';
    const acount = await existNajieThing(usr_qq, thing_name, '装备');
    if (!acount) {
        void Send(Text(`你没有[${thing_name}]这样的装备`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, '装备', -1);
    const x = 0.4;
    const random1 = Math.random();
    const y = 0.3;
    const random2 = Math.random();
    const z = 0.2;
    const random3 = Math.random();
    const p = 0.1;
    const random4 = Math.random();
    let m = '';
    let lingshi = 0;
    if (random1 < x) {
        if (random2 < y) {
            if (random3 < z) {
                if (random4 < p) {
                    lingshi = 2000000;
                    m = player.名号 + '打开了[' + thing_name + ']金光一现！' + lingshi + '颗灵石！';
                }
                else {
                    lingshi = 1000000;
                    m = player.名号 + '打开了[' + thing_name + ']金光一现!' + lingshi + '颗灵石！';
                }
            }
            else {
                lingshi = 400000;
                m = player.名号 + '打开了[' + thing_name + ']你很开心的得到了' + lingshi + '颗灵石！';
            }
        }
        else {
            lingshi = 180000;
            m = player.名号 + '打开了[' + thing_name + ']你很开心的得到了' + lingshi + '颗灵石！';
        }
    }
    else {
        lingshi = 100000;
        m = player.名号 + '打开了[' + thing_name + ']你很开心的得到了' + lingshi + '颗灵石！';
    }
    await addCoin(usr_qq, lingshi);
    Send(Text(m));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
