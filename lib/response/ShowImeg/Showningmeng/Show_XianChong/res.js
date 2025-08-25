import { useSend, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getXianChongImage } from '../../../../model/image.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import { redis } from '../../../../model/api.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?仙宠楼$/;
const CD_MS = 10 * 1000;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const cdKey = getRedisKey(usr_qq, 'petShowCD');
    const now = Date.now();
    const last = toInt(await redis.get(cdKey));
    if (now < last + CD_MS) {
        Send(Text(`查看过于频繁，请${Math.ceil((last + CD_MS - now) / 1000)}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const evt = e;
    const img = await getXianChongImage(evt);
    if (!img) {
        Send(Text('生成图片失败，请稍后再试'));
        return false;
    }
    const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img);
    Send(Image(buffer));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
