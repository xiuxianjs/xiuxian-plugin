import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer, readNajie } from '../../../../model/xiuxian_impl.js';
import { addCoin } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import { foundthing } from '../../../../model/cultivation.js';
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

const regular = /^(#|＃|\/)?回收.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    let thing_name = e.MessageText.replace(/^(#|＃|\/)?回收/, '');
    thing_name = thing_name.trim();
    const thing_exist = await foundthing(thing_name);
    if (thing_exist) {
        Send(Text(`${thing_name}可以使用,不需要回收`));
        return false;
    }
    let lingshi = 0;
    const najie = await readNajie(usr_qq);
    if (!najie) {
        return false;
    }
    const type = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
    ];
    for (const cate of type) {
        const list = najie[cate];
        if (!Array.isArray(list)) {
            continue;
        }
        const thing = list.find(item => item.name == thing_name);
        if (!thing) {
            continue;
        }
        const sell = typeof thing.出售价 === 'number' ? thing.出售价 : 0;
        const num = typeof thing.数量 === 'number' ? thing.数量 : 0;
        const cls = thing.class || cate;
        if (cls == '材料' || cls == '草药') {
            lingshi += sell * num;
        }
        else {
            lingshi += sell * 2 * num;
        }
        if (num !== 0) {
            await addNajieThing(usr_qq, thing.name, cls, -num, thing.pinji);
        }
    }
    await addCoin(usr_qq, lingshi);
    Send(Text(`回收成功,获得${lingshi}灵石`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
