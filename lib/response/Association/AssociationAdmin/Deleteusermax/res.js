import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
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
import { playerEfficiency } from '../../../../model/efficiency.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?逐出.*$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v;
}
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function')
            continue;
        if (v && typeof v === 'object')
            r[k] = JSON.parse(JSON.stringify(v));
        else
            r[k] = v;
    }
    return r;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门))
        return false;
    const member_qq = e.MessageText.replace(/^(#|＃|\/)?逐出/, '').trim();
    if (!member_qq) {
        Send(Text('请输入要逐出成员的QQ'));
        return false;
    }
    if (usr_qq === member_qq) {
        Send(Text('不能踢自己'));
        return false;
    }
    if (!(await data.existData('player', member_qq))) {
        Send(Text('此人未踏入仙途！'));
        return false;
    }
    const playerB = (await data.getData('player', member_qq));
    if (!playerB ||
        !notUndAndNull(playerB.宗门) ||
        !isPlayerGuildRef(playerB.宗门)) {
        Send(Text('对方尚未加入宗门'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    const bssRaw = await data.getAssociation(playerB.宗门.宗门名称);
    if (assRaw === 'error' ||
        bssRaw === 'error' ||
        !isExtAss(assRaw) ||
        !isExtAss(bssRaw))
        return false;
    const ass = assRaw;
    const bss = bssRaw;
    if (ass.宗门名称 !== bss.宗门名称)
        return false;
    const actorRole = player.宗门.职位;
    const targetRole = playerB.宗门.职位;
    const removeMember = () => {
        const roleList = bss[targetRole];
        if (Array.isArray(roleList)) {
            bss[targetRole] = roleList.filter(q => q !== member_qq);
        }
        bss.所有成员 = Array.isArray(bss.所有成员)
            ? bss.所有成员.filter(q => q !== member_qq)
            : [];
        delete playerB.宗门;
    };
    if (actorRole === '宗主') {
        removeMember();
        await data.setAssociation(bss.宗门名称, bss);
        await data.setData('player', member_qq, serializePlayer(playerB));
        await playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    if (actorRole === '副宗主') {
        if (targetRole === '宗主') {
            Send(Text('你没权限'));
            return false;
        }
        if (targetRole === '长老' || targetRole === '副宗主') {
            Send(Text(`宗门${targetRole}任免请上报宗主！`));
            return false;
        }
        removeMember();
        await data.setAssociation(bss.宗门名称, bss);
        await data.setData('player', member_qq, serializePlayer(playerB));
        await playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    if (actorRole === '长老') {
        if (targetRole === '宗主' || targetRole === '副宗主') {
            Send(Text('造反啦？'));
            return false;
        }
        if (targetRole === '长老') {
            Send(Text(`宗门${targetRole}任免请上报宗主！`));
            return false;
        }
        removeMember();
        await data.setAssociation(bss.宗门名称, bss);
        await data.setData('player', member_qq, serializePlayer(playerB));
        await playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    return false;
});

export { res as default, regular };
