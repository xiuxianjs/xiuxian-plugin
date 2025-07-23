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
import { isNotNull, timestampToTime, player_efficiency } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)加入宗门.*$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (isNotNull(player.宗门))
        return false;
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    let association_name = e.MessageText.replace('#加入宗门', '');
    association_name = association_name.trim();
    let ifexistass = data.existData('association', association_name);
    if (!ifexistass) {
        Send(Text('这方天地不存在' + association_name));
        return false;
    }
    let ass = data.getAssociation(association_name);
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id >= 42 && ass.power == 0) {
        Send(Text('仙人不可下界！'));
        return false;
    }
    if (now_level_id < 42 && ass.power == 1) {
        Send(Text('你在仙界吗？就去仙界宗门'));
        return false;
    }
    if (ass.最低加入境界 > now_level_id) {
        let level = data.Level_list.find(item => item.level_id === ass.最低加入境界).level;
        Send(Text(`${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`));
        return false;
    }
    let mostmem = 宗门人数上限[ass.宗门等级 - 1];
    let nowmem = ass.所有成员.length;
    if (mostmem <= nowmem) {
        Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`));
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let date = timestampToTime(nowTime);
    player.宗门 = {
        宗门名称: association_name,
        职位: '外门弟子',
        time: [date, nowTime]
    };
    data.setData('player', usr_qq, player);
    ass.所有成员.push(usr_qq);
    ass.外门弟子.push(usr_qq);
    await player_efficiency(usr_qq);
    data.setAssociation(association_name, ass);
    Send(Text(`恭喜你成功加入${association_name}`));
});

export { res as default, regular, selects };
