import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import 'yaml';
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
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { find_qinmidu, sleep } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?查询亲密度$/;
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

export { res as default, regular };
