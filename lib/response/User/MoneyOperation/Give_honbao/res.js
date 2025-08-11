import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { Go } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?发红包.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const MIN_PER = 10000;
const MAX_PACKETS = 200;
const MAX_TOTAL = 5_000_000_000;
const CD_MS = 30 * 1000;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    if (!(await Go(e)))
        return false;
    const cdKey = `xiuxian@1.3.0:${usr_qq}:giveHongbaoCD`;
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
    if (count > MAX_PACKETS)
        count = MAX_PACKETS;
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
    const existing = await redis.get(`xiuxian@1.3.0:${usr_qq}:honbaoacount`);
    if (existing && Number(existing) > 0) {
        Send(Text('你已有未被抢完的红包，稍后再发'));
        return false;
    }
    await redis.set(`xiuxian@1.3.0:${usr_qq}:honbao`, String(per));
    await redis.set(`xiuxian@1.3.0:${usr_qq}:honbaoacount`, String(count));
    await addCoin(usr_qq, -total);
    await redis.set(cdKey, String(now));
    Send(Text(`【全服公告】${player.名号}发了${count}个${per}灵石的红包！`));
    return false;
});

export { res as default, regular };
