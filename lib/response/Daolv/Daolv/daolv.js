import '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import '../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { useMessage, Text } from 'alemonjs';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import { readQinmidu } from '../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';

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
function chaoshi(e) {
    const [message] = useMessage(e);
    const chaoshiTime = setTimeout(() => {
        if (Daolv.x === 1 || Daolv.x === 2) {
            Daolv.set_x(0);
            void message.send(format(Text('对方没有搭理你')));
            return false;
        }
    }, 30000);
    Daolv.set_chaoshi_time(chaoshiTime);
}
async function found(A, B) {
    const qinmidu = await readQinmidu();
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A === A && qinmidu[i].QQ_B === B) || (qinmidu[i].QQ_A === B && qinmidu[i].QQ_B === A)) {
            break;
        }
    }
    return i;
}

export { Daolv, chaoshi, found };
