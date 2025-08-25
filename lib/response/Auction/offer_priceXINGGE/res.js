import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { getConfig } from '../../../model/Config.js';
import '@alemonjs/db';
import { KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK } from '../../../model/constants.js';
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

const regular = /^(#|＃|\/)?星阁出价.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    if (!(await redis.sismember(redisGlKey, String(e.ChannelId)))) {
        return false;
    }
    const auction = await redis.get(KEY_AUCTION_OFFICIAL_TASK);
    if (!notUndAndNull(auction)) {
        const { openHour, closeHour } = (await getConfig('xiuxian', 'xiuxian')).Auction;
        Send(Text(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`));
        return false;
    }
    const player = await readPlayer(usr_qq);
    const auctionData = JSON.parse(auction);
    const last_price = auctionData.last_price;
    const reg = e.MessageText.replace(/^(#|＃|\/)?星阁出价/, '');
    if (auctionData.last_offer_player == usr_qq) {
        Send(Text('不能自己给自己抬价哦!'));
        return false;
    }
    let new_price = Number(reg);
    if (!new_price) {
        new_price = Math.floor(Math.ceil(last_price * 1.1));
    }
    else {
        if (new_price < Math.ceil(last_price * 1.1)) {
            Send(Text(`最新价格为${last_price}，每次加价不少于10 %！`));
            return false;
        }
    }
    if (player.灵石 < new_price) {
        Send(Text('没这么多钱也想浑水摸鱼?'));
        return false;
    }
    auctionData.groupList = await redis.smembers(redisGlKey);
    const msg = `${player.名号}叫价${new_price} `;
    Send(Text(msg));
    auctionData.last_price = new_price;
    auctionData.last_offer_player = usr_qq;
    auctionData.last_offer_price = Date.now();
    await redis.set(KEY_AUCTION_OFFICIAL_TASK, JSON.stringify(auctionData));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
