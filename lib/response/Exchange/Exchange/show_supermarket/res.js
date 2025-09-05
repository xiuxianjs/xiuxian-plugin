import { useSend, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getSupermarketImage } from '../../../../model/image.js';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?冲水堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/;
const VALID = ['装备', '丹药', '功法', '道具', '草药', '仙宠', '材料'];
const CD_MS = 10 * 1000;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const cdKey = getRedisKey(userId, 'supermarketCD');
    const now = Date.now();
    const lastTs = toInt(await redis.get(cdKey));
    if (now < lastTs + CD_MS) {
        void Send(Text(`查看过于频繁，请${Math.ceil((lastTs + CD_MS - now) / 1000)}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const raw = e.MessageText.replace(/^(#|＃|\/)?冲水堂/, '').trim();
    const cate = VALID.find(v => v === raw) || undefined;
    if (raw && !cate) {
        void Send(Text('类别无效，可选: ' + VALID.join('/')));
        return false;
    }
    const img = await getSupermarketImage(e, cate);
    if (!img) {
        void Send(Text('生成列表失败，请稍后再试'));
        return false;
    }
    const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img);
    void Send(Image(buffer));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
