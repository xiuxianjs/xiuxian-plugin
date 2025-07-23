import { useSend, Text } from 'alemonjs';
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
import '../../../../model/XiuxianData.js';
import { existplayer, foundthing, Read_najie, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)打磨.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing_name = e.MessageText.replace('#', '');
    thing_name = thing_name.replace('打磨', '');
    let code = thing_name.split('*');
    thing_name = code[0];
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`));
        return false;
    }
    let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
    pj = pj[code[1]];
    if (pj > 5 ||
        (thing_exist.atk < 10 && thing_exist.def < 10 && thing_exist.HP < 10)) {
        Send(Text(`${thing_name}(${code[1]})不支持打磨`));
        return false;
    }
    let najie = await Read_najie(usr_qq);
    let x = 0;
    for (let i of najie['装备']) {
        if (i.name == thing_name && i.pinji == pj)
            x++;
    }
    if (x < 3) {
        Send(Text(`你只有${thing_name}(${code[1]})x${x}`));
        return false;
    }
    for (let i = 0; i < 3; i++)
        await Add_najie_thing(usr_qq, thing_name, '装备', -1, pj);
    await Add_najie_thing(usr_qq, thing_name, '装备', 1, pj + 1);
    Send(Text('打磨成功获得' + thing_name));
});

export { res as default, regular, selects };
