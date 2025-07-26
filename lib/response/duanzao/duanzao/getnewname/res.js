import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { readIt } from '../../../../model/duanzaofu.js';
import { existplayer, existNajieThing, foundthing, readNajie, Write_najie } from '../../../../model/xiuxian.js';
import { writeIt } from '../../../../model/pub.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?赋名.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    let thing = e.MessageText.replace(/^(#|＃|\/)?赋名/, '');
    const code = thing.split('*');
    const thing_name = code[0];
    let new_name = code[1];
    const thingnum = await existNajieThing(user_qq, thing_name, '装备');
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
        A = await readIt();
    }
    catch {
        await writeIt([]);
        A = await readIt();
    }
    for (let item of A) {
        if (item.name == thing_name) {
            Send(Text(`一个装备只能赋名一次`));
            return false;
        }
    }
    const thingall = await readNajie(user_qq);
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
                    await writeIt(A);
                    Send(Text(`附名成功,您的${thing_name}更名为${new_name}`));
                    return false;
                }
            }
        }
    }
    Send(Text(`您的装备太弱了,无法赋予名字`));
});

export { res as default, regular };
