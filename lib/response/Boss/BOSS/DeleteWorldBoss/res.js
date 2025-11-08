import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { KEY_WORLD_BOOS_STATUS, KEY_RECORD } from '../../../../model/keys.js';
import mw from '../../../mw-captcha.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?关闭妖王$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        await redis.del(KEY_WORLD_BOOS_STATUS);
        await redis.del(KEY_RECORD);
        void Send(Text('妖王挑战关闭！'));
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular, selects };
