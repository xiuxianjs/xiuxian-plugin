import { useSend, Text, Image } from 'alemonjs';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import { getNajieImage } from '../../../../model/image.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?我的纳戒$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const CD_MS = 10 * 1000;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const cdKey = `xiuxian@1.3.0:${usr_qq}:showNajieCD`;
    const lastTs = toInt(await redis.get(cdKey));
    const now = Date.now();
    if (now < lastTs + CD_MS) {
        const remain = lastTs + CD_MS - now;
        const s = Math.ceil(remain / 1000);
        Send(Text(`请求过于频繁，请${s}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const publicEvent = e;
    const img = await getNajieImage(publicEvent);
    if (!img) {
        Send(Text('纳戒信息生成失败，请稍后重试'));
        return false;
    }
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
        return false;
    }
    Send(Text('图片加载失败'));
    return false;
});

export { res as default, regular };
