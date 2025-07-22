import 'yaml';
import 'fs';
import '../../../config/help/Association.yaml.js';
import '../../../config/help/help.yaml.js';
import '../../../config/help/helpcopy.yaml.js';
import '../../../config/help/set.yaml.js';
import '../../../config/help/shituhelp.yaml.js';
import '../../../config/parameter/namelist.yaml.js';
import '../../../config/task/task.yaml.js';
import '../../../config/version/version.yaml.js';
import '../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../model/paths.js';
import '../../../model/XiuxianData.js';
import { Read_qinmidu } from '../../../model/xiuxian.js';

global.x = 0;
global.chaoshi_time = null;
global.user_A = null;
global.user_B = null;
async function chaoshi(e) {
    global.chaoshi_time = setTimeout(() => {
        if (global.x == 1 || global.x == 2) {
            global.x = 0;
            e.reply('对方没有搭理你');
            return false;
        }
    }, 30000);
}
async function found(A, B) {
    let qinmidu = await Read_qinmidu();
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
            (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    return i;
}

export { chaoshi, found };
