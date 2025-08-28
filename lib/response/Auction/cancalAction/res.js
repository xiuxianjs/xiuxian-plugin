import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import { KEY_AUCTION_GROUP_LIST } from '../../../model/constants.js';
import mw from '../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?取消星阁体系$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以取消'));
        return false;
    }
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    if (!(await redis.sismember(redisGlKey, String(e.ChannelId)))) {
        void Send(Text('本来就没开取消个冒险'));
        return false;
    }
    await redis.srem(redisGlKey, String(e.ChannelId));
    void Send(Text('星阁体系在本群取消了'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
