import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { KEY_AUCTION_OFFICIAL_TASK } from '../../../model/constants.js';
import '@alemonjs/db';
import '../../../model/settions.js';
import '../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../model/common.js';
import 'lodash-es';
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

const regular = /^(#|＃|\/)?星阁拍卖行$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const res = await redis.get(KEY_AUCTION_OFFICIAL_TASK);
    if (!notUndAndNull(res)) {
        Send(Text('目前没有拍卖正在进行'));
        return false;
    }
    const auction = JSON.parse(res);
    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
    if (auction.last_offer_player === 0) {
        msg += '暂无人出价';
    }
    else {
        const player = await readPlayer(auction.last_offer_player);
        msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
    }
    await Send(Text(msg));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
