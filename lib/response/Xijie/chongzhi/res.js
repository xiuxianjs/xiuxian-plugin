import { useSend, Text } from 'alemonjs';
import '../../../model/api.js';
import 'yaml';
import 'fs';
import '../../../config/help/association.yaml.js';
import '../../../config/help/base.yaml.js';
import '../../../config/help/extensions.yaml.js';
import '../../../config/help/admin.yaml.js';
import '../../../config/help/professor.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../model/settions.js';
import data from '../../../model/XiuxianData.js';
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
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'crypto';
import '../../../route/core/auth.js';
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
