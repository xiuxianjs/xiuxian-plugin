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
import '@alemonjs/db';
import { notUndAndNull, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?宗门捐献记录$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await data.getData('player', usr_qq);
    if (!notUndAndNull(player.宗门))
        return false;
    let ass = await data.getAssociation(player.宗门.宗门名称);
    let donate_list = [];
    for (let i in ass.所有成员) {
        let member_qq = ass.所有成员[i];
        let member_data = await data.getData('player', member_qq);
        if (!notUndAndNull(member_data.宗门.lingshi_donate)) {
            member_data.宗门.lingshi_donate = 0;
        }
        donate_list[i] = {
            name: member_data.名号,
            lingshi_donate: member_data.宗门.lingshi_donate
        };
    }
    donate_list.sort(sortBy('lingshi_donate'));
    let msg = [`${ass.宗门名称} 灵石捐献记录表`];
    for (let i = 0; i < donate_list.length; i++) {
        msg.push(`第${i + 1}名  ${donate_list[i].name}  捐赠灵石:${donate_list[i].lingshi_donate}`);
    }
    await Send(Text(msg.join('')));
});

export { res as default, regular };
