import { useSend, useMention, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^任命.*/;
const 副宗主人数上限 = [1, 1, 1, 1, 2, 2, 3, 3];
const 长老人数上限 = [1, 2, 3, 4, 5, 7, 8, 9];
const 内门弟子上限 = [2, 3, 4, 5, 6, 8, 10, 12];
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    let member_qq = User.UserId;
    if (usr_qq == member_qq) {
        Send(Text('???'));
        return false;
    }
    let ass = await data.getAssociation(player.宗门.宗门名称);
    let isinass = ass.所有成员.some(item => item == member_qq);
    if (!isinass) {
        Send(Text('只能设置宗门内弟子的职位'));
        return false;
    }
    let member = data.getData('player', member_qq);
    let now_apmt = member.宗门.职位;
    if (player.宗门.职位 == '副宗主' && now_apmt == '宗主') {
        Send(Text('你想造反吗！？'));
        return false;
    }
    if (player.宗门.职位 == '副宗主' &&
        (now_apmt == '副宗主' || now_apmt == '长老')) {
        Send(Text(`宗门${now_apmt}任免请上报宗主！`));
        return false;
    }
    let full_apmt = ass.所有成员.length;
    let reg = new RegExp(/副宗主|长老|外门弟子|内门弟子/);
    let msg = reg.exec(e.MessageText);
    if (!msg) {
        Send(Text('请输入正确的职位'));
        return false;
    }
    let appointment = msg[0];
    if (appointment == now_apmt) {
        Send(Text(`此人已经是本宗门的${appointment}`));
        return false;
    }
    if (appointment == '长老') {
        full_apmt = 长老人数上限[ass.宗门等级 - 1];
    }
    if (appointment == '副宗主') {
        full_apmt = 副宗主人数上限[ass.宗门等级 - 1];
    }
    else if (appointment == '内门弟子') {
        full_apmt = 内门弟子上限[ass.宗门等级 - 1];
    }
    if (ass[appointment].length >= full_apmt) {
        Send(Text(`本宗门的${appointment}人数已经达到上限`));
        return false;
    }
    member.宗门.职位 = appointment;
    ass[now_apmt] = ass[now_apmt].filter(item => item != member_qq);
    ass[appointment].push(member_qq);
    data.setData('player', member_qq, member);
    data.setAssociation(ass.宗门名称, ass);
    Send(Text(`${ass.宗门名称} ${player.宗门.职位} 已经成功将${member.名号}任命为${appointment}!`));
});

export { res as default, regular };
