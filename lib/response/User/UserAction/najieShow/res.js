import { useSend, Text, Image } from 'alemonjs';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { redis } from '../../../../model/api.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import { getNajieImage } from '../../../../model/image.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/xiuxian_m.js';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我的纳戒$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const CD_MS = 10 * 1000;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const cdKey = getRedisKey(userId, 'showNajieCD');
    const lastTs = toInt(await redis.get(cdKey));
    const now = Date.now();
    if (now < lastTs + CD_MS) {
        const remain = lastTs + CD_MS - now;
        const s = Math.ceil(remain / 1000);
        void Send(Text(`请求过于频繁，请${s}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const publicEvent = e;
    const img = await getNajieImage(publicEvent);
    if (!img) {
        void Send(Text('纳戒信息生成失败，请稍后重试'));
        return false;
    }
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
        return false;
    }
    void Send(Text('图片加载失败'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
