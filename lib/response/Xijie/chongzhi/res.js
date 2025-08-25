import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../model/settions.js';
import { getDataList } from '../../../model/DataList.js';
import '../../../model/xiuxian_impl.js';
import 'lodash-es';
import { readShop, writeShop } from '../../../model/shop.js';
import '../../../model/api.js';
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
import 'fs';
import 'crypto';
import '../../../route/core/auth.js';
import mw, { selects } from '../../mw.js';

const regular = /^(#|＃|\/)?重置.*$/;
const res = onResponse(selects, async (e) => {
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
        const shopList = await getDataList('Shop');
        await writeShop(shopList);
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
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
