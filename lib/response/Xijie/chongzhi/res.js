import { useSend, Text } from 'alemonjs';
import '../../../model/api.js';
import '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/xiuxian.yaml.js';
import data from '../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../model/xiuxian_impl.js';
import '../../../model/danyao.js';
import 'lodash-es';
import '../../../model/equipment.js';
import { readShop, writeShop } from '../../../model/shop.js';
import '../../../model/trade.js';
import '../../../model/qinmidu.js';
import '../../../model/shitu.js';
import '../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/img/user_state.png.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/styles/najie.scss.js';
import '../../../resources/styles/player.scss.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/valuables.scss.js';
import '../../../resources/img/valuables-top.jpg.js';
import '../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../index.js';

const regular = /^(#|＃|\/)?重置.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    const didian = e.MessageText.replace(/^(#|＃|\/)?重置/, '').trim();
    if (!didian) {
        Send(Text('请在指令后填写要重置的商店名称'));
        return false;
    }
    let shop;
    try {
        shop = await readShop();
    }
    catch {
        await writeShop(data.shop_list);
        shop = await readShop();
    }
    const idx = shop.findIndex(s => s.name === didian);
    if (idx === -1)
        return false;
    const slot = shop[idx];
    slot.state = 0;
    await writeShop(shop);
    Send(Text(`重置成功: ${didian}`));
    return false;
});

export { res as default, regular };
