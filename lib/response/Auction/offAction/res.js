import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import mw, { selects } from '../../mw.js';
import { KEY_AUCTION_OFFICIAL_TASK, KEY_AUCTION_GROUP_LIST } from '../../../model/constants.js';

const regular = /^(#|＃|\/)?关闭星阁体系$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以关闭'));
        return false;
    }
    await redis.del(KEY_AUCTION_OFFICIAL_TASK);
    await redis.del(KEY_AUCTION_GROUP_LIST);
    Send(Text('星阁体系已关闭！'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
