import { useSend, Text } from 'alemonjs';
import { notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { redis } from '../../../../model/api.js';
import { __PATH } from '../../../../model/keys.js';
import mw, { selects } from '../../../mw.js';
import { writePlayer } from '../../../../model/pub.js';

const regular = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石\d+$/;
const 宗门灵石池上限 = [
    2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000
];
function isGuildInfo(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function') {
            continue;
        }
        if (v && typeof v === 'object') {
            r[k] = JSON.parse(JSON.stringify(v));
        }
        else {
            r[k] = v;
        }
    }
    return r;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player || !notUndAndNull(player.宗门) || !isGuildInfo(player.宗门)) {
        return false;
    }
    const reg = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石/;
    const msg = e.MessageText.replace(reg, '').trim();
    if (!msg) {
        Send(Text('请输入灵石数量'));
        return false;
    }
    const lingshi = Number.parseInt(msg, 10);
    if (!Number.isFinite(lingshi) || lingshi <= 0) {
        Send(Text('请输入正确的灵石数量'));
        return false;
    }
    if (player.灵石 < lingshi) {
        Send(Text(`你身上只有${player.灵石}灵石,数量不足`));
        return false;
    }
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
    const guildLevel = Number(ass.宗门等级 ?? 1);
    const pool = Number(ass.灵石池 ?? 0);
    const xf = ass.power === 1 ? 10 : 1;
    const capIndex = Math.max(0, Math.min(宗门灵石池上限.length - 1, guildLevel - 1));
    const cap = 宗门灵石池上限[capIndex] * xf;
    if (pool + lingshi > cap) {
        const remain = cap - pool;
        Send(Text(`${ass.宗门名称}的灵石池最多还能容纳${remain}灵石,请重新捐赠`));
        return false;
    }
    ass.灵石池 = pool + lingshi;
    player.宗门.lingshi_donate = (player.宗门.lingshi_donate || 0) + lingshi;
    player.灵石 -= lingshi;
    await writePlayer(usr_qq, serializePlayer(player));
    await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
    Send(Text(`捐赠成功,你身上还有${player.灵石}灵石,宗门灵石池目前有${ass.灵石池}灵石`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
