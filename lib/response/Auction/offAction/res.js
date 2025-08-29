import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import mw, { selects } from '../../mw.js';
import { getAuctionKeys } from '../../../model/constants.js';
import { getAppCofig } from '../../../model/Config.js';

const regular = /^(#|＃|\/)?关闭星阁体系$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以关闭'));
        return false;
    }
    const { botId } = getAppCofig();
    const auctionKeys = getAuctionKeys(botId);
    await redis.del(auctionKeys.AUCTION_OFFICIAL_TASK);
    await redis.del(auctionKeys.AUCTION_GROUP_LIST);
    void Send(Text('星阁体系已关闭！'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
