import { useSend, Text } from 'alemonjs';
import { redis } from '../../../api/api.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)关闭星阁体系$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有只因器人主人可以关闭'));
        return false;
    }
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    await redis.del('xiuxian:AuctionofficialTask');
    await redis.del(redisGlKey);
    Send(Text('星阁体系已关闭！'));
    return false;
});

export { res as default, regular, selects };
