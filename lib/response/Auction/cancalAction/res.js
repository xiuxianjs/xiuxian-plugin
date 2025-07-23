import { useSend, Text } from 'alemonjs';
import { redis } from '../../../api/api.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?取消星阁体系$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有只因器人主人可以取消'));
        return false;
    }
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    if (!redis.sismember(redisGlKey, String(e.ChannelId))) {
        Send(Text('本来就没开取消个冒险'));
        return false;
    }
    await redis.srem(redisGlKey, String(e.ChannelId));
    Send(Text('星阁体系在本群取消了'));
});

export { res as default, regular, selects };
