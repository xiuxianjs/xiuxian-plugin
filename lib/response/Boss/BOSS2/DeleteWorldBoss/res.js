import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import mw, { selects } from '../../../mw.js';
import { KEY_WORLD_BOOS_STATUS_TWO, KEY_RECORD_TWO } from '../../../../model/keys.js';

const regular = /^(#|＃|\/)?关闭金角大王$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        await redis.del(KEY_WORLD_BOOS_STATUS_TWO);
        await redis.del(KEY_RECORD_TWO);
        void Send(Text('金角大王挑战关闭！'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
