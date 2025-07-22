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
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';
import { Read_tiandibang, Write_tiandibang } from '../tian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)报名比赛/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang;
    try {
        tiandibang = await Read_tiandibang();
    }
    catch {
        await Write_tiandibang([]);
        tiandibang = await Read_tiandibang();
    }
    let x = tiandibang.length;
    for (let i = 0; i < tiandibang.length; i++) {
        if (tiandibang[i].qq == usr_qq) {
            x = i;
            break;
        }
    }
    if (x == tiandibang.length) {
        let player = await Read_player(usr_qq);
        let level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        let A_player = {
            名号: player.名号,
            境界: level_id,
            攻击: player.攻击,
            防御: player.防御,
            当前血量: player.血量上限,
            暴击率: player.暴击率,
            灵根: player.灵根,
            法球倍率: player.灵根.法球倍率,
            学习的功法: player.学习的功法,
            qq: usr_qq,
            次数: 0,
            积分: 0
        };
        tiandibang.push(A_player);
        await Write_tiandibang(tiandibang);
        Send(Text('参赛成功!'));
        return false;
    }
    else {
        Send(Text('你已经参赛了!'));
        return false;
    }
});

export { res as default, name, regular, selects };
