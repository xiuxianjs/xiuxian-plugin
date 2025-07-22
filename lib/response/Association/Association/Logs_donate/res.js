import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, sortBy } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)宗门捐献记录$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门))
        return false;
    let ass = data.getAssociation(player.宗门.宗门名称);
    let donate_list = [];
    for (let i in ass.所有成员) {
        let member_qq = ass.所有成员[i];
        let member_data = data.getData('player', member_qq);
        if (!isNotNull(member_data.宗门.lingshi_donate)) {
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

export { res as default, name, regular, selects };
