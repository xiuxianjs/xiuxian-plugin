import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { getConfig } from '../../../model/Config.js';
import '../../../config/help/association.yaml.js';
import '../../../config/help/base.yaml.js';
import '../../../config/help/extensions.yaml.js';
import '../../../config/help/admin.yaml.js';
import '../../../config/help/professor.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../model/xiuxian_impl.js';
import '../../../model/danyao.js';
import { notUndAndNull } from '../../../model/common.js';
import 'lodash-es';
import '../../../model/equipment.js';
import '../../../model/shop.js';
import '../../../model/trade.js';
import '../../../model/qinmidu.js';
import '../../../model/shitu.js';
import '../../../model/temp.js';
import '../../../model/settions.js';
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
import 'fs';
import 'crypto';
import '../../../route/core/auth.js';
import { selects } from '../../index.js';

const regular = /^(#|＃|\/)?星阁出价.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    if (!(await redis.sismember(redisGlKey, String(e.ChannelId))))
        return false;
    const auction = await redis.get('xiuxian:AuctionofficialTask');
    if (!notUndAndNull(auction)) {
        const { openHour, closeHour } = (await getConfig('xiuxian', 'xiuxian'))
            .Auction;
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
    await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(auctionData));
});

export { res as default, regular };
