import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import { getAuctionKeyManager } from '../../../model/auction.js';
import 'dayjs';
import { readPlayer } from '../../../model/xiuxiandata.js';
import '../../../model/DataList.js';
import '../../../model/settions.js';
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
import { getConfig } from '../../../model/Config.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import { openAU } from '../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import mw from '../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?开启星阁体系$/;
function isExchangeRecord(v) {
    return !!v && typeof v === 'object' && 'thing' in v && 'start_price' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以开启'));
        return false;
    }
    const auctionKeyManager = getAuctionKeyManager();
    const channelId = String(e.ChannelId);
    const already = await auctionKeyManager.isGroupAuctionEnabled(channelId);
    if (already) {
        void Send(Text('星阁拍卖行已经开啦'));
        return false;
    }
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await redis.smembers(groupListKey);
    if (groupList.length > 0) {
        await auctionKeyManager.enableGroupAuction(channelId);
        void Send(Text('星阁已开启，已将本群添加至星阁体系'));
        return false;
    }
    const cfg = (await getConfig('xiuxian', 'xiuxian'));
    const openHour = typeof cfg.openHour === 'number' ? cfg.openHour : 20;
    const closeHour = typeof cfg.closeHour === 'number' ? cfg.closeHour : 22;
    const now = new Date();
    const day0 = new Date(now);
    const midnight = day0.setHours(0, 0, 0, 0);
    const openTime = midnight + openHour * 3600 * 1000;
    const closeTime = midnight + closeHour * 3600 * 1000;
    const nowTs = now.getTime();
    if (nowTs > openTime && nowTs < closeTime) {
        try {
            const auction = await openAU();
            if (!isExchangeRecord(auction)) {
                throw new Error('拍卖数据结构异常');
            }
            let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
            if (auction.last_offer_player === 0) {
                msg += '暂无人出价';
            }
            else {
                const player = await readPlayer(String(auction.last_offer_player));
                if (player) {
                    msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
                }
            }
            void Send(Text(msg));
        }
        catch (err) {
            void Send(Text('开启拍卖失败: ' + err.message));
            return false;
        }
    }
    else {
        void Send(Text('当前不在星阁开启时间，将直接初始化空白场次'));
    }
    void redis.del(groupListKey);
    await auctionKeyManager.enableGroupAuction(channelId);
    void Send(Text('星阁体系在本群开启！'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
