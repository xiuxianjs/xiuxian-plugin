import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
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
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import { Read_tiandibang, Write_tiandibang } from '../tian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)天地榜$/;
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
    let l = 10;
    let msg = ['***天地榜(每日免费三次)***\n       周一0点清空积分'];
    for (let i = 0; i < tiandibang.length; i++) {
        if (tiandibang[i].qq == usr_qq) {
            x = i;
            break;
        }
    }
    if (x == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    if (l > tiandibang.length) {
        l = tiandibang.length;
    }
    if (x < l) {
        for (let m = 0; m < l; m++) {
            msg.push('名次：' +
                (m + 1) +
                '\n名号：' +
                tiandibang[m].名号 +
                '\n积分：' +
                tiandibang[m].积分);
        }
    }
    else if (x >= l && tiandibang.length - x < l) {
        for (let m = tiandibang.length - l; m < tiandibang.length; m++) {
            msg.push('名次：' +
                (m + 1) +
                '\n名号：' +
                tiandibang[m].名号 +
                '\n积分：' +
                tiandibang[m].积分);
        }
    }
    else {
        for (let m = x - 5; m < x + 5; m++) {
            msg.push('名次：' +
                (m + 1) +
                '\n名号：' +
                tiandibang[m].名号 +
                '\n积分：' +
                tiandibang[m].积分);
        }
    }
    Send(Text(msg.join('\n')));
});

export { res as default, name, regular, selects };
