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

const Daolv = {
    x: 0,
    chaoshi_time: null,
    user_A: null,
    user_B: null,
    set_x(value) {
        this.x = value;
    },
    set_chaoshi_time(value) {
        this.chaoshi_time = value;
    },
    set_user_A(value) {
        this.user_A = value;
    },
    set_user_B(value) {
        this.user_B = value;
    }
};
async function chaoshi(e) {
    const [message] = useMessage(e);
    const chaoshi_time = setTimeout(() => {
        if (Daolv.x == 1 || Daolv.x == 2) {
            Daolv.set_x(0);
            message.send(format(Text('对方没有搭理你')));
            return false;
        }
    }, 30000);
    Daolv.set_chaoshi_time(chaoshi_time);
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

export { Daolv, chaoshi, found };
