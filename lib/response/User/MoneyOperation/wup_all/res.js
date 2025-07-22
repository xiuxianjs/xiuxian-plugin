import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import 'yaml';
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
import { __PATH, Add_灵石 as Add___, Add_修为 as Add___$1, Add_血气 as Add___$2, foundthing, Add_najie_thing } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)全体发.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    let File_length = File.length;
    let thing_name = e.MessageText.replace('#全体发', '');
    let code = thing_name.split('*');
    thing_name = code[0];
    let thing_amount = code[1];
    let thing_piji;
    thing_amount = Number(thing_amount);
    if (isNaN(thing_amount)) {
        thing_amount = 1;
    }
    if (thing_name == '灵石') {
        for (let i = 0; i < File_length; i++) {
            let this_qq = File[i].replace('.json', '');
            await Add___(this_qq, thing_amount);
        }
    }
    else if (thing_name == '修为') {
        for (let i = 0; i < File_length; i++) {
            let this_qq = File[i].replace('.json', '');
            await Add___$1(this_qq, thing_amount);
        }
    }
    else if (thing_name == '血气') {
        for (let i = 0; i < File_length; i++) {
            let this_qq = File[i].replace('.json', '');
            await Add___$2(this_qq, thing_amount);
        }
    }
    else {
        let thing_exist = await foundthing(thing_name);
        if (!thing_exist) {
            Send(Text(`这方世界没有[${thing_name}]`));
            return false;
        }
        let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
        thing_piji = pj[code[1]];
        if (thing_exist.class == '装备') {
            if (thing_piji) {
                thing_amount = code[2];
            }
            else {
                thing_piji = 0;
            }
        }
        thing_amount = Number(thing_amount);
        if (isNaN(thing_amount)) {
            thing_amount = 1;
        }
        for (let i = 0; i < File_length; i++) {
            let this_qq = File[i].replace('.json', '');
            await Add_najie_thing(this_qq, thing_name, thing_exist.class, thing_amount, thing_piji);
        }
    }
    Send(Text(`发放成功,目前共有${File_length}个玩家,每人增加${thing_name} x ${thing_amount}`));
});

export { res as default, name, regular, selects };
