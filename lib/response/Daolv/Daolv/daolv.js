import '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import '../../../api/api.js';
import { readQinmidu } from '../../../model/xiuxian.js';
import 'dayjs';
import { useMessage, Text } from 'alemonjs';

global.x = 0;
global.chaoshi_time = null;
global.user_A = null;
global.user_B = null;
async function chaoshi(e) {
    const [message] = useMessage(e);
    global.chaoshi_time = setTimeout(() => {
        if (global.x == 1 || global.x == 2) {
            global.x = 0;
            message.send(format(Text('对方没有搭理你')));
            return false;
        }
    }, 30000);
}
async function found(A, B) {
    let qinmidu = await readQinmidu();
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
