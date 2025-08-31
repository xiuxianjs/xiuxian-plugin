import { useSend, Text, Image } from 'alemonjs';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { getNajieImage } from '../../../../model/image.js';
import 'crypto';
import 'posthog-node';
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
