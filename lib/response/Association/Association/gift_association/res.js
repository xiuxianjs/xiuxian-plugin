import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { __PATH, getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull, shijianc } from '../../../../model/common.js';
import 'lodash-es';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { isNotMaintenance, getLastsign_Asso } from '../../ass.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?宗门俸禄$/;
function isDateParts(v) {
    return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
function isGuildInfo(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function')
            continue;
        if (v && typeof v === 'object') {
            r[k] = JSON.parse(JSON.stringify(v));
        }
        else
            r[k] = v;
    }
    return r;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (!player || !notUndAndNull(player.宗门) || !isGuildInfo(player.宗门))
        return false;
    const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);
    if (!assData) {
        Send(Text('宗门数据异常'));
        return;
    }
    const assRaw = JSON.parse(assData);
    if (assRaw === 'error') {
        Send(Text('宗门数据不存在或已损坏'));
        return false;
    }
    const ass = assRaw;
    const ismt = isNotMaintenance(ass);
    if (ismt) {
        Send(Text('宗门尚未维护，快找宗主维护宗门'));
        return false;
    }
    const nowTime = Date.now();
    const Today = await shijianc(nowTime);
    const lastsign_time = await getLastsign_Asso(usr_qq);
    if (isDateParts(Today) && isDateParts(lastsign_time)) {
        if (Today.Y === lastsign_time.Y &&
            Today.M === lastsign_time.M &&
            Today.D === lastsign_time.D) {
            Send(Text('今日已经领取过了'));
            return false;
        }
    }
    const role = player.宗门.职位;
    if (role === '外门弟子' || role === '内门弟子') {
        Send(Text('没有资格领取俸禄'));
        return false;
    }
    let n = 1;
    if (role === '长老')
        n = 3;
    else if (role === '副宗主')
        n = 4;
    else if (role === '宗主')
        n = 5;
    const exAss = ass;
    const buildLevel = Number(exAss.宗门建设等级 ?? 0);
    const guildLevel = Number(exAss.宗门等级 ?? 0);
    const fuli = Math.trunc(buildLevel * 2000);
    let gift_lingshi = Math.trunc(guildLevel * 1200 * n + fuli);
    gift_lingshi = Math.trunc(gift_lingshi / 2);
    const pool = Number(ass.灵石池 || 0);
    if (pool - gift_lingshi < 0) {
        Send(Text('宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧'));
        return false;
    }
    ass.灵石池 = pool - gift_lingshi;
    player.灵石 += gift_lingshi;
    await redis.set(getRedisKey(usr_qq, 'lastsign_Asso_time'), nowTime);
    await writePlayer(usr_qq, serializePlayer(player));
    await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
    Send(Text(`宗门俸禄领取成功,获得了${gift_lingshi}灵石`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
