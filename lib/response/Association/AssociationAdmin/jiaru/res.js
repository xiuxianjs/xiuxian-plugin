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
import { isNotNull } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)设置门槛.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let player = await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门))
        return false;
    if (player.宗门.职位 == '宗主' ||
        player.宗门.职位 == '副宗主' ||
        player.宗门.职位 == '长老') ;
    else {
        Send(Text('只有宗主、副宗主或长老可以操作'));
        return false;
    }
    let jiar = e.MessageText.replace('#设置门槛', '');
    jiar = jiar.trim();
    if (!data.Level_list.some(item => item.level == jiar))
        return false;
    let jr_level_id = data.Level_list.find(item => item.level == jiar).level_id;
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (ass.power == 0 && jr_level_id > 41) {
        jr_level_id = 41;
        Send(Text('不知哪位大能立下誓言：凡界无仙！'));
    }
    if (ass.power == 1 && jr_level_id < 42) {
        jr_level_id = 42;
        Send(Text('仅仙人可加入仙宗'));
    }
    ass.最低加入境界 = jr_level_id;
    Send(Text('已成功设置宗门门槛，当前门槛:' + jiar));
    data.setAssociation(ass.宗门名称, ass);
});

export { res as default, name, regular, selects };
