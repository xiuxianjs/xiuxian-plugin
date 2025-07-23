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
import { Read_it } from '../../../../model/duanzaofu.js';
import { existplayer, exist_najie_thing, foundthing, Read_najie, Write_najie } from '../../../../model/xiuxian.js';
import { Writeit } from '../../../../model/pub.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?赋名.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    let thing = e.MessageText.replace('(#|＃|/)?', '');
    thing = thing.replace('赋名', '');
    const code = thing.split('*');
    const thing_name = code[0];
    let new_name = code[1];
    const thingnum = await exist_najie_thing(user_qq, thing_name, '装备');
    if (!thingnum) {
        Send(Text(`你没有这件装备`));
        return false;
    }
    const newname = await foundthing(new_name);
    if (newname) {
        Send(Text(`这个世间已经拥有这把武器了`));
        return false;
    }
    if (newname.length > 8) {
        Send(Text('字符超出最大限制,请重新赋名'));
        return false;
    }
    let A;
    try {
        A = await Read_it();
    }
    catch {
        await Writeit([]);
        A = await Read_it();
    }
    for (let item of A) {
        if (item.name == thing_name) {
            Send(Text(`一个装备只能赋名一次`));
            return false;
        }
    }
    const thingall = await Read_najie(user_qq);
    for (let item of thingall.装备) {
        if (item.name == thing_name) {
            if (item.atk < 10 && item.def < 10 && item.HP < 10) {
                if (item.atk >= 1.5 ||
                    item.def >= 1.2 ||
                    (item.type == '法宝' && (item.atk >= 1 || item.def >= 1)) ||
                    item.atk + item.def > 1.95) {
                    item.name = new_name;
                    A.push(item);
                    await Write_najie(user_qq, thingall);
                    await Writeit(A);
                    Send(Text(`附名成功,您的${thing_name}更名为${new_name}`));
                    return false;
                }
            }
        }
    }
    Send(Text(`您的装备太弱了,无法赋予名字`));
});

export { res as default, regular };
