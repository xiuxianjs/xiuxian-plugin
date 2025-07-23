import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?设置门槛.*$/;
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
    let jiar = e.MessageText.replace('(#|＃|/)?设置门槛', '');
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

export { res as default, regular };
