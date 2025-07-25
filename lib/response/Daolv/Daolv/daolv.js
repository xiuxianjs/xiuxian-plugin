import '../../../model/Config.js';
import 'fs';
import 'path';
import '../../../model/paths.js';
import '../../../model/XiuxianData.js';
import { Read_qinmidu } from '../../../model/xiuxian.js';
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
