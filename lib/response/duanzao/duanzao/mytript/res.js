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
import { looktripod, Read_mytripod } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian.js';
import '../../../../model/paths.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)我的锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text(`请先去#炼器师能力评测,再来煅炉吧`));
        return false;
    }
    let a = await Read_mytripod(user_qq);
    if (a.材料.length == 0) {
        Send(Text(`锻炉里空空如也,没什么好看的`));
        return false;
    }
    let shuju = [];
    let shuju2 = [];
    let xuanze = 0;
    let b = '您的锻炉里,拥有\n';
    for (let item in a.材料) {
        for (let item1 in shuju) {
            if (shuju[item1] == a.材料[item]) {
                shuju2[item1] = shuju2[item1] * 1 + a.数量[item] * 1;
                xuanze = 1;
            }
        }
        if (xuanze == 0) {
            shuju.push(a.材料[item]);
            shuju2.push(a.数量[item]);
        }
        else {
            xuanze = 0;
        }
    }
    for (let item2 in shuju) {
        b += shuju[item2] + shuju2[item2] + '个\n';
    }
    Send(Text(b));
});

export { res as default, regular, selects };
