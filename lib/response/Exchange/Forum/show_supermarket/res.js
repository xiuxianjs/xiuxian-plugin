import { useSend, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getForumImage } from '../../../../model/image.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'dayjs';
import 'lodash-es';
import '../../../../model/settions.js';
import { redis } from '../../../../model/api.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/;
const VALID = [
    '装备',
    '丹药',
    '功法',
    '道具',
    '草药',
    '仙宠',
    '材料'
];
const CD_MS = 10 * 1000;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const cdKey = getRedisKey(usr_qq, 'forumShowCD');
    const now = Date.now();
    const lastTs = toInt(await redis.get(cdKey));
    if (now < lastTs + CD_MS) {
        Send(Text(`查看过于频繁，请${Math.ceil((lastTs + CD_MS - now) / 1000)}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const raw = e.MessageText.replace(/^(#|＃|\/)?聚宝堂/, '').trim();
    const cate = VALID.find(v => v === raw) || undefined;
    if (raw && !cate) {
        Send(Text('类别无效，可选: ' + VALID.join('/')));
        return false;
    }
    const evt = e;
    const img = await getForumImage(evt, cate);
    if (!img) {
        Send(Text('生成列表失败，请稍后再试'));
        return false;
    }
    const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img);
    Send(Image(buffer));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
