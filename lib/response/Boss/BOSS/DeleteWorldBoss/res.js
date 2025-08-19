import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { BossIsAlive } from '../../../../model/boss.js';
import { KEY_WORLD_BOOS_STATUS, KEY_RECORD } from '../../../../model/constants.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?关闭妖王$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        if (await BossIsAlive()) {
            await redis.del(KEY_WORLD_BOOS_STATUS);
            await redis.del(KEY_RECORD);
            Send(Text('妖王挑战关闭！'));
        }
        else {
            Send(Text('妖王未开启'));
        }
    }
});

export { res as default, regular, selects };
