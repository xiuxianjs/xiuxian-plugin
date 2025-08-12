import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { readQinmidu, writeQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { Daolv, found } from '../daolv.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(我同意|我拒绝)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.UserId != Daolv.user_B)
        return false;
    if (Daolv.x == 2) {
        const player_A = await readPlayer(Daolv.user_A);
        const player_B = await readPlayer(Daolv.user_B);
        const qinmidu = await readQinmidu();
        const i = await found(Daolv.user_A, Daolv.user_B);
        if (i != qinmidu.length) {
            if (e.MessageText == '我同意') {
                qinmidu[i].婚姻 = 0;
                await writeQinmidu(qinmidu);
                Send(Text(`${player_A.名号}和${player_B.名号}和平分手`));
            }
            else if (e.MessageText == '我拒绝') {
                Send(Text(`${player_B.名号}拒绝了${player_A.名号}提出的建议`));
            }
        }
        clearTimeout(Daolv.chaoshi_time);
        Daolv.set_chaoshi_time(null);
        Daolv.set_x(0);
        return false;
    }
});

export { res as default, regular };
