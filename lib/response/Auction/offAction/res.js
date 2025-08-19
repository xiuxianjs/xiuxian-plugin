import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { selects } from '../../mw.js';
import { KEY_AUCTION_OFFICIAL_TASK, KEY_AUCTION_GROUP_LIST } from '../../../model/constants.js';

const regular = /^(#|＃|\/)?关闭星阁体系$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以关闭'));
        return false;
    }
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    await redis.del(KEY_AUCTION_OFFICIAL_TASK);
    await redis.del(redisGlKey);
    Send(Text('星阁体系已关闭！'));
    return false;
});

export { res as default, regular };
