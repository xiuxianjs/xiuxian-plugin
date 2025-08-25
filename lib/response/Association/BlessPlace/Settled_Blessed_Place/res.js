import { useSend, Text } from 'alemonjs';
import { keys, keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
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

const regular = /^(#|＃|\/)?入驻洞天.*$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function isBlessPlace(v) {
    return !!v && typeof v === 'object' && 'name' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 !== '宗主') {
        Send(Text('只有宗主可以操作'));
        return false;
    }
    const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
    if (!assRaw) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    const blessed_name = e.MessageText.replace(/^(#|＃|\/)?入驻洞天/, '').trim();
    if (!blessed_name) {
        Send(Text('请在指令后补充洞天名称'));
        return false;
    }
    const blessRaw = await getDataList('Bless');
    const dongTan = blessRaw?.find(i => isBlessPlace(i) && i.name === blessed_name);
    if (!dongTan) {
        Send(Text('未找到该洞天'));
        return false;
    }
    if (ass.宗门驻地 === dongTan.name) {
        Send(Text('该洞天已是你宗门的驻地'));
        return false;
    }
    const guildNames = await keysByPath(__PATH.association);
    const assDatas = await Promise.all(guildNames.map(n => getDataJSONParseByKey(keys.association(n))));
    const assListRaw = assDatas.filter(Boolean);
    for (const other of assListRaw) {
        if (other === 'error' || !isExtAss(other)) {
            continue;
        }
        if (other.宗门名称 === ass.宗门名称) {
            continue;
        }
        if (other.宗门驻地 !== dongTan.name) {
            continue;
        }
        const attackMembers = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
        const defendMembers = Array.isArray(other.所有成员) ? other.所有成员 : [];
        let attackPower = 0;
        for (const m of attackMembers) {
            const memberData = await readPlayer(m);
            const val = Math.trunc(memberData.攻击 + memberData.血量上限 * 0.5);
            attackPower += val;
        }
        let defendPower = 0;
        for (const m of defendMembers) {
            const memberData = await readPlayer(m);
            const val = Math.trunc(memberData.防御 + memberData.血量上限 * 0.5);
            defendPower += val;
        }
        const randA = Math.random();
        const randB = Math.random();
        if (randA > 0.75) {
            attackPower = Math.trunc(attackPower * 1.1);
        }
        else if (randA < 0.25) {
            attackPower = Math.trunc(attackPower * 0.9);
        }
        if (randB > 0.75) {
            defendPower = Math.trunc(defendPower * 1.1);
        }
        else if (randB < 0.25) {
            defendPower = Math.trunc(defendPower * 0.9);
        }
        const ass阵血 = Math.max(0, Number(ass.大阵血量 || 0));
        const other阵血 = Math.max(0, Number(other.大阵血量 || 0));
        const ass建设 = Math.max(0, Number(ass.宗门建设等级 || 0));
        const other建设 = Math.max(0, Number(other.宗门建设等级 || 0));
        attackPower += ass建设 * 100 + Math.trunc(ass阵血 / 2);
        defendPower += other建设 * 100 + other阵血;
        if (attackPower > defendPower) {
            const oldSite = ass.宗门驻地;
            other.宗门驻地 = oldSite;
            ass.宗门驻地 = dongTan.name;
            ass.宗门建设等级 = other建设;
            other.宗门建设等级 = Math.max(0, other建设 - 10);
            other.大阵血量 = 0;
            await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
            await setDataJSONStringifyByKey(keys.association(other.宗门名称), other);
            Send(Text(`洞天被占据！${ass.宗门名称} 发动进攻 (战力${attackPower}) 攻破 ${other.宗门名称} (防御${defendPower})，夺取了 ${dongTan.name}`));
        }
        else {
            await setDataJSONStringifyByKey(keys.association(other.宗门名称), other);
            Send(Text(`${ass.宗门名称} 进攻 ${other.宗门名称} 失败 (进攻${attackPower} / 防御${defendPower})`));
        }
        return false;
    }
    ass.宗门驻地 = dongTan.name;
    ass.宗门建设等级 = 0;
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    Send(Text(`入驻成功，${ass.宗门名称} 当前驻地为：${dongTan.name}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
