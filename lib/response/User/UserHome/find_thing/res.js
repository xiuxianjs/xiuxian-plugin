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
import { foundthing, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)哪里有(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let reg = new RegExp(/哪里有/);
    let msg = e.MessageText.replace(reg, '');
    msg = msg.replace('#', '');
    let thing_name = msg.replace('哪里有', '');
    let didian = [
        'guildSecrets_list',
        'forbiddenarea_list',
        'Fairyrealm_list',
        'timeplace_list',
        'didian_list',
        'shenjie',
        'mojie',
        'xingge',
        'shop_list'
    ];
    let found = [];
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`));
        return false;
    }
    let number = await exist_najie_thing(usr_qq, '寻物纸', '道具');
    if (!number) {
        Send(Text('查找物品需要【寻物纸】'));
        return false;
    }
    for (let i of didian) {
        for (let j of data[i]) {
            let n = ['one', 'two', 'three'];
            for (let k of n) {
                if (j[k] && j[k].find(item => item.name == thing_name)) {
                    found.push(j.name + '\n');
                    break;
                }
            }
        }
    }
    found.push('消耗了一张寻物纸');
    if (found.length == 1) {
        Send(Text('天地没有回应......'));
    }
    else {
        await Send(Text(found.join('')));
    }
    await Add_najie_thing(usr_qq, '寻物纸', '道具', -1);
});

export { res as default, name, regular, selects };
