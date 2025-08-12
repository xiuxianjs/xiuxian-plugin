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
import { existplayer, readPlayer, readNajie, addBagCoin } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
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
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(存|取)灵石(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const flag = await Go(e);
    if (!flag)
        return false;
    const reg = new RegExp(/取|存/);
    const func = reg.exec(e.MessageText)[0];
    let msg = e.MessageText.replace(reg, '');
    msg = msg.replace(/^(#|＃|\/)?/, '');
    let lingshi = msg.replace('灵石', '').trim();
    if (func === '存' && lingshi === '全部') {
        const P = await readPlayer(usr_qq);
        lingshi = P.灵石;
    }
    if (func === '取' && lingshi === '全部') {
        const N = await readNajie(usr_qq);
        lingshi = N.灵石;
    }
    if (typeof lingshi !== 'number') {
        lingshi = await convert2integer(lingshi);
    }
    if (func == '存') {
        const player_info = await readPlayer(usr_qq);
        const player_lingshi = player_info.灵石;
        if (player_lingshi < lingshi) {
            Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`));
            return false;
        }
        const najie = await readNajie(usr_qq);
        if (najie.灵石上限 < najie.灵石 + lingshi) {
            await addBagCoin(usr_qq, najie.灵石上限 - najie.灵石);
            await addCoin(usr_qq, -najie.灵石上限 + najie.灵石);
            Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`));
            return false;
        }
        await addBagCoin(usr_qq, lingshi);
        await addCoin(usr_qq, -lingshi);
        Send(Text(`储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${najie.灵石 + lingshi}灵石`));
        return false;
    }
    if (func == '取') {
        const najie = await readNajie(usr_qq);
        if (najie.灵石 < lingshi) {
            Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`));
            return false;
        }
        await addBagCoin(usr_qq, -lingshi);
        await addCoin(usr_qq, lingshi);
        Send(Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`));
        return false;
    }
});

export { res as default, regular };
