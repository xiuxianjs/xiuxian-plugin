import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?^任命.*/;
const 副宗主人数上限 = [1, 1, 1, 1, 2, 2, 3, 3];
const 长老人数上限 = [1, 2, 3, 4, 5, 7, 8, 9];
const 内门弟子上限 = [2, 3, 4, 5, 6, 8, 10, 12];
const VALID_APPOINT = ['副宗主', '长老', '内门弟子', '外门弟子'];
function isAppointment(v) {
    return VALID_APPOINT.includes(v);
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
        void Send(Text('你尚未加入宗门'));
        return false;
    }
    const playerGuild = player['宗门'];
    const role = playerGuild.职位;
    if (role !== '宗主' && role !== '副宗主') {
        void Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const memberQq = target.UserId;
    if (userId === memberQq) {
        void Send(Text('不能对自己任命'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass || !isKeys(ass, ['宗门名称', '所有成员', '宗门等级'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const assData = ass;
    assData.所有成员 = Array.isArray(assData.所有成员) ? assData.所有成员 : [];
    if (!assData.所有成员.includes(memberQq)) {
        void Send(Text('只能设置宗门内弟子的职位'));
        return false;
    }
    const member = await getDataJSONParseByKey(keys.player(memberQq));
    if (!member) {
        void Send(Text('目标玩家数据不存在'));
        return false;
    }
    if (!isKeys(member['宗门'], ['宗门名称', '职位'])) {
        void Send(Text('目标玩家宗门信息异常'));
        return false;
    }
    const memberData = member;
    const memberGuild = member['宗门'];
    const nowApmt = memberGuild.职位;
    if (role === '副宗主' && nowApmt === '宗主') {
        void Send(Text('你想造反吗！？'));
        return false;
    }
    if (role === '副宗主' && (nowApmt === '副宗主' || nowApmt === '长老')) {
        void Send(Text(`宗门${nowApmt}任免请上报宗主！`));
        return false;
    }
    const match = /(副宗主|长老|外门弟子|内门弟子)/.exec(e.MessageText);
    if (!match) {
        void Send(Text('请输入正确的职位'));
        return false;
    }
    const appointment = match[0];
    if (!isAppointment(appointment)) {
        void Send(Text('无效职位'));
        return false;
    }
    if (appointment === nowApmt) {
        void Send(Text(`此人已经是本宗门的${appointment}`));
        return false;
    }
    const level = Number(assData.宗门等级 || 1);
    const idx = Math.max(0, Math.min(副宗主人数上限.length - 1, level - 1));
    const limitMap = {
        副宗主: 副宗主人数上限[idx],
        长老: 长老人数上限[idx],
        内门弟子: 内门弟子上限[idx],
        外门弟子: Infinity
    };
    const listMap = (role) => {
        const raw = assData[role];
        return Array.isArray(raw) ? raw : [];
    };
    const targetList = listMap(appointment);
    if (targetList.length >= limitMap[appointment]) {
        void Send(Text(`本宗门的${appointment}人数已经达到上限`));
        return false;
    }
    const oldList = listMap(nowApmt);
    assData[nowApmt] = oldList.filter(q => q !== memberQq);
    targetList.push(memberQq);
    assData[appointment] = targetList;
    memberGuild.职位 = appointment;
    await setDataJSONStringifyByKey(keys.player(memberQq), member);
    await setDataJSONStringifyByKey(keys.association(assData.宗门名称), assData);
    void Send(Text(`${assData.宗门名称} ${role} 已经成功将${memberData.名号}任命为${appointment}!`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
