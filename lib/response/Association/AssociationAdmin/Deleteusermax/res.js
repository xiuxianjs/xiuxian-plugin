import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, playerEfficiency } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?逐出.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        return false;
    }
    let menpai = e.MessageText.replace(/^(#|＃|\/)?逐出/, '');
    let member_qq = menpai;
    if (usr_qq == member_qq) {
        Send(Text('???'));
        return false;
    }
    let ifexistplayB = await data.existData('player', member_qq);
    if (!ifexistplayB) {
        Send(Text('此人未踏入仙途！'));
        return false;
    }
    let playerB = await await data.getData('player', member_qq);
    if (!isNotNull(playerB.宗门)) {
        Send(Text('对方尚未加入宗门'));
        return false;
    }
    let ass = await data.getAssociation(player.宗门.宗门名称);
    let bss = await data.getAssociation(playerB.宗门.宗门名称);
    if (ass.宗门名称 != bss.宗门名称)
        return false;
    if (player.宗门.职位 == '宗主') {
        if (usr_qq == member_qq) {
            Send(Text('？？？'));
            return false;
        }
        bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(item => item != member_qq);
        bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq);
        data.setAssociation(bss.宗门名称, bss);
        delete playerB.宗门;
        data.setData('player', member_qq, playerB);
        playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    if (player.宗门.职位 == '副宗主') {
        if (playerB.宗门.职位 == '宗主') {
            Send(Text('你没权限'));
            return false;
        }
        if (playerB.宗门.职位 == '长老' || playerB.宗门.职位 == '副宗主') {
            Send(Text(`宗门${playerB.宗门.职位}任免请上报宗主！`));
            return false;
        }
        bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(item => item != member_qq);
        bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq);
        data.setAssociation(bss.宗门名称, bss);
        delete playerB.宗门;
        data.setData('player', member_qq, playerB);
        playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    if (player.宗门.职位 == '长老') {
        if (playerB.宗门.职位 == '宗主' || playerB.宗门.职位 == '副宗主') {
            Send(Text('造反啦？'));
            return false;
        }
        if (playerB.宗门.职位 == '长老') {
            Send(Text(`宗门${playerB.宗门.职位}任免请上报宗主！`));
            return false;
        }
        bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(item => item != member_qq);
        bss['所有成员'] = bss['所有成员'].filter(item => item != member_qq);
        await data.setAssociation(bss.宗门名称, bss);
        await delete playerB.宗门;
        await data.setData('player', member_qq, playerB);
        await playerEfficiency(member_qq);
        Send(Text('已踢出！'));
        return false;
    }
    playerB.favorability = 0;
    await data.setData('player', member_qq, playerB);
});

export { res as default, regular };
