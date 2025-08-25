import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import data from '../../../../model/XiuxianData.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?^任命.*/;
const 副宗主人数上限 = [1, 1, 1, 1, 2, 2, 3, 3];
const 长老人数上限 = [1, 2, 3, 4, 5, 7, 8, 9];
const 内门弟子上限 = [2, 3, 4, 5, 6, 8, 10, 12];
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
const VALID_APPOINT = ['副宗主', '长老', '内门弟子', '外门弟子'];
function isAppointment(v) {
    return VALID_APPOINT.includes(v);
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000)
        return false;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player ||
        !notUndAndNull(player.宗门) ||
        !isPlayerGuildRef(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const member_qq = target.UserId;
    if (usr_qq === member_qq) {
        Send(Text('不能对自己任命'));
        return false;
    }
    if (!(await data.existData('player', member_qq))) {
        Send(Text('目标未踏入仙途'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw))
        return false;
    const ass = assRaw;
    ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    if (!ass.所有成员.includes(member_qq)) {
        Send(Text('只能设置宗门内弟子的职位'));
        return false;
    }
    const member = (await data.getData('player', member_qq));
    if (!member || !notUndAndNull(member.宗门) || !isPlayerGuildRef(member.宗门))
        return false;
    const now_apmt = member.宗门.职位;
    if (player.宗门.职位 === '副宗主' && now_apmt === '宗主') {
        Send(Text('你想造反吗！？'));
        return false;
    }
    if (player.宗门.职位 === '副宗主' &&
        (now_apmt === '副宗主' || now_apmt === '长老')) {
        Send(Text(`宗门${now_apmt}任免请上报宗主！`));
        return false;
    }
    const match = /(副宗主|长老|外门弟子|内门弟子)/.exec(e.MessageText);
    if (!match) {
        Send(Text('请输入正确的职位'));
        return false;
    }
    const appointment = match[0];
    if (!isAppointment(appointment)) {
        Send(Text('无效职位'));
        return false;
    }
    if (appointment === now_apmt) {
        Send(Text(`此人已经是本宗门的${appointment}`));
        return false;
    }
    const level = Number(ass.宗门等级 || 1);
    const idx = Math.max(0, Math.min(副宗主人数上限.length - 1, level - 1));
    const limitMap = {
        副宗主: 副宗主人数上限[idx],
        长老: 长老人数上限[idx],
        内门弟子: 内门弟子上限[idx],
        外门弟子: Infinity
    };
    const listMap = (role) => {
        const raw = ass[role];
        return Array.isArray(raw) ? raw : [];
    };
    const targetList = listMap(appointment);
    if (targetList.length >= limitMap[appointment]) {
        Send(Text(`本宗门的${appointment}人数已经达到上限`));
        return false;
    }
    const oldList = listMap(now_apmt);
    ass[now_apmt] = oldList.filter(q => q !== member_qq);
    targetList.push(member_qq);
    ass[appointment] = targetList;
    member.宗门.职位 = appointment;
    await data.setData('player', member_qq, serializePlayer(member));
    await data.setAssociation(ass.宗门名称, ass);
    Send(Text(`${ass.宗门名称} ${player.宗门.职位} 已经成功将${member.名号}任命为${appointment}!`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
