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
import { existplayer, readNajie } from '../../../../model/xiuxian_impl.js';
import { addCoin } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
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

const regular = /^(#|＃|\/)?回收.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing_name = e.MessageText.replace(/^(#|＃|\/)?回收/, '');
    thing_name = thing_name.trim();
    const thing_exist = await foundthing(thing_name);
    if (thing_exist) {
        Send(Text(`${thing_name}可以使用,不需要回收`));
        return false;
    }
    let lingshi = 0;
    const najie = await readNajie(usr_qq);
    if (!najie)
        return false;
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
        if (!Array.isArray(list))
            continue;
        const thing = list.find(item => item.name == thing_name);
        if (!thing)
            continue;
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

export { res as default, regular };
