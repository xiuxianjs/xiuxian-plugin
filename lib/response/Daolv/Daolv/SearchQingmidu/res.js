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
import { __PATH, find_qinmidu, sleep } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)查询亲密度$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A = e.UserId;
    let flag = 0;
    let msg = [];
    msg.push(`\n-----qq----- -亲密度-`);
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    for (let i = 0; i < File.length; i++) {
        let B = File[i].replace('.json', '');
        if (A == B) {
            continue;
        }
        let pd = await find_qinmidu(A, B);
        if (pd == false) {
            continue;
        }
        flag++;
        msg.push(`\n${B}\t ${pd}`);
    }
    if (flag == 0) {
        Send(Text(`其实一个人也不错的`));
    }
    else {
        for (let i = 0; i < msg.length; i += 8) {
            Send(Text(msg.slice(i, i + 8).join('')));
            await sleep(500);
        }
    }
});

export { res as default, name, regular, selects };
