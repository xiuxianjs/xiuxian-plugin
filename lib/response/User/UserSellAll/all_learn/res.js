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
import { existplayer, Read_player, Add_najie_thing, Add_player_学习功法 as Add_player_____ } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)一键学习$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await data.getData('najie', usr_qq);
    let player = await Read_player(usr_qq);
    let name = '';
    for (let l of najie.功法) {
        let islearned = player.学习的功法.find(item => item == l.name);
        if (!islearned) {
            await Add_najie_thing(usr_qq, l.name, '功法', -1);
            await Add_player_____(usr_qq, l.name);
            name = name + ' ' + l.name;
        }
    }
    if (name) {
        Send(Text(`你学会了${name},可以在【#我的炼体】中查看`));
    }
    else {
        Send(Text('无新功法'));
    }
});

export { res as default, name, regular, selects };
