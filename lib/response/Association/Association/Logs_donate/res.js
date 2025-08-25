import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { __PATH, keys } from '../../../../model/keys.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?宗门捐献记录$/;
function isExtAss(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v;
}
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门))
        return false;
    const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);
    if (!assData) {
        Send(Text('宗门数据异常'));
        return;
    }
    const assRaw = JSON.parse(assData);
    if (assRaw === 'error' || !isExtAss(assRaw))
        return false;
    const ass = assRaw;
    const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    if (members.length === 0) {
        Send(Text('宗门暂无成员'));
        return false;
    }
    const donate_list = [];
    for (const member_qq of members) {
        const ext = await redis.exists(keys.player(member_qq));
        if (!ext) {
            continue;
        }
        const res = await redis.get(keys.player(member_qq));
        if (!res) {
            continue;
        }
        let member_data = null;
        try {
            member_data = JSON.parse(res);
        }
        catch (error) {
            logger.warn(error);
            continue;
        }
        if (!member_data) {
            continue;
        }
        if (!member_data ||
            !notUndAndNull(member_data.宗门) ||
            !isPlayerGuildRef(member_data.宗门))
            continue;
        const donate = Number(member_data.宗门.lingshi_donate || 0);
        donate_list.push({
            name: String(member_data.名号 || member_qq),
            lingshi_donate: donate
        });
    }
    if (donate_list.length === 0) {
        Send(Text('暂无捐献记录'));
        return false;
    }
    donate_list.sort((a, b) => b.lingshi_donate - a.lingshi_donate);
    const msg = [`${ass.宗门名称} 灵石捐献记录表`];
    donate_list.forEach((row, idx) => {
        msg.push(`第${idx + 1}名  ${row.name}  捐赠灵石:${row.lingshi_donate}`);
    });
    await Send(Text(msg.join('\n')));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
