import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { BossIsAlive } from '../../../../model/boss.js';
import { KEY_WORLD_BOOS_STATUS, KEY_RECORD } from '../../../../model/constants.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?关闭妖王$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        if (await BossIsAlive()) {
            await redis.del(KEY_WORLD_BOOS_STATUS);
            await redis.del(KEY_RECORD);
            void Send(Text('妖王挑战关闭！'));
        }
        else {
            void Send(Text('妖王未开启'));
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
