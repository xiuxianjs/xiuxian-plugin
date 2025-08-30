import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import { getAuctionKeyManager } from '../../../model/auction.js';
import { notUndAndNull } from '../../../model/common.js';
import { readPlayer } from '../../../model/xiuxiandata.js';
import '../../../model/DataList.js';
import 'lodash-es';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { getConfig } from '../../../model/Config.js';
import '../../../model/currency.js';
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
import 'posthog-node';
import '../../../model/message.js';
import mw, { selects } from '../../mw.js';

const regular = /^(#|＃|\/)?星阁出价.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const auctionKeyManager = getAuctionKeyManager();
    const isGroupEnabled = await auctionKeyManager.isGroupAuctionEnabled(String(e.ChannelId));
    if (!isGroupEnabled) {
        void Send(Text('本群未开启星阁拍卖'));
        return false;
    }
    const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
    const auction = await redis.get(auctionTaskKey);
    const cfg = await getConfig('xiuxian', 'xiuxian');
    if (!notUndAndNull(auction)) {
        const { openHour, closeHour } = cfg.Auction;
        void Send(Text(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`));
        return false;
    }
    const auctionData = JSON.parse(auction);
    const lastPrice = auctionData.last_price;
    const reg = e.MessageText.replace(/^(#|＃|\/)?星阁出价/, '');
    if (auctionData.last_offer_player === userId) {
        void Send(Text('不能自己给自己抬价哦!'));
        return false;
    }
    let newPrice = Number(reg);
    if (!newPrice) {
        newPrice = Math.floor(Math.ceil(lastPrice * 1.1));
    }
    else {
        if (newPrice < Math.ceil(lastPrice * 1.1)) {
            void Send(Text(`最新价格为${lastPrice}，每次加价不少于10 %！`));
            return false;
        }
    }
    if (player.灵石 < newPrice) {
        void Send(Text('没这么多钱也想浑水摸鱼?'));
        return false;
    }
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    auctionData.groupList = await redis.smembers(groupListKey);
    const msg = `${player.名号}叫价${newPrice} `;
    void Send(Text(msg));
    auctionData.lastPrice = newPrice;
    auctionData.last_offer_player = userId;
    auctionData.last_offer_price = Date.now();
    await redis.set(auctionTaskKey, JSON.stringify(auctionData));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
