import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { Go } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
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
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?发红包.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const MIN_PER = 10000;
const MAX_PACKETS = 200;
const MAX_TOTAL = 5_000_000_000;
const CD_MS = 30 * 1000;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    if (!(await Go(e))) {
        return false;
    }
    const cdKey = getRedisKey(usr_qq, 'giveHongbaoCD');
    const now = Date.now();
    const lastTs = toInt(await redis.get(cdKey));
    if (now < lastTs + CD_MS) {
        const remain = Math.ceil((lastTs + CD_MS - now) / 1000);
        Send(Text(`操作太频繁，请${remain}秒后再发红包`));
        return false;
    }
    const body = e.MessageText.replace(/^(#|＃|\/)?发红包/, '').trim();
    const seg = body
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (seg.length < 2) {
        Send(Text('格式: 发红包金额*个数'));
        return false;
    }
    let per = toInt(await convert2integer(seg[0]), 0);
    let count = toInt(await convert2integer(seg[1]), 0);
    if (per <= 0 || count <= 0) {
        Send(Text('金额与个数需为正整数'));
        return false;
    }
    per = Math.trunc(per / MIN_PER) * MIN_PER;
    if (per < MIN_PER) {
        Send(Text(`单个红包至少 ${MIN_PER} 灵石`));
        return false;
    }
    if (count > MAX_PACKETS) {
        count = MAX_PACKETS;
    }
    const total = per * count;
    if (!Number.isFinite(total) || total <= 0) {
        Send(Text('金额异常'));
        return false;
    }
    if (total > MAX_TOTAL) {
        Send(Text('总额过大，已拒绝'));
        return false;
    }
    const player = await data.getData('player', usr_qq);
    if (!player || Array.isArray(player)) {
        Send(Text('存档异常'));
        return false;
    }
    if (player.灵石 < total) {
        Send(Text('红包数要比自身灵石数小噢'));
        return false;
    }
    const existing = await redis.get(getRedisKey(usr_qq, 'honbaoacount'));
    if (existing && Number(existing) > 0) {
        Send(Text('你已有未被抢完的红包，稍后再发'));
        return false;
    }
    await redis.set(getRedisKey(usr_qq, 'honbao'), String(per));
    await redis.set(getRedisKey(usr_qq, 'honbaoacount'), String(count));
    await addCoin(usr_qq, -total);
    await redis.set(cdKey, String(now));
    Send(Text(`【全服公告】${player.名号}发了${count}个${per}灵石的红包！`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
