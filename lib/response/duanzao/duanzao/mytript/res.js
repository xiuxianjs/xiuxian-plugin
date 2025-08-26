import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { looktripod, readMytripod } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/DataList.js';
import 'dayjs';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我的锻炉/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq))) {
        return false;
    }
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text('请先去#炼器师能力评测,再来煅炉吧'));
        return false;
    }
    const a = await readMytripod(user_qq);
    if (a.材料.length == 0) {
        Send(Text('锻炉里空空如也,没什么好看的'));
        return false;
    }
    const shuju = [];
    const shuju2 = [];
    let xuanze = 0;
    let b = '您的锻炉里,拥有\n';
    for (const item in a.材料) {
        for (const item1 in shuju) {
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
    for (const item2 in shuju) {
        b += shuju[item2] + shuju2[item2] + '个\n';
    }
    Send(Text(b));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
