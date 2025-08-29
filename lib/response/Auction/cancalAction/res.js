import { useSend, Text } from 'alemonjs';
import { getAuctionKeyManager } from '../../../model/constants.js';
import mw from '../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?取消星阁体系$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以取消'));
        return false;
    }
    const auctionKeyManager = getAuctionKeyManager();
    const groupId = String(e.ChannelId);
    const isGroupEnabled = await auctionKeyManager.isGroupAuctionEnabled(groupId);
    if (!isGroupEnabled) {
        void Send(Text('本群未开启星阁拍卖'));
        return false;
    }
    await auctionKeyManager.disableGroupAuction(groupId);
    void Send(Text('星阁体系在本群取消了'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
