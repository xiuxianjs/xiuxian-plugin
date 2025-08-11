import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { sleep } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { findQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?查询亲密度$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = e.UserId;
    let flag = 0;
    const msg = [];
    msg.push(`\n-----qq----- -亲密度-`);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let i = 0; i < playerList.length; i++) {
        const B = playerList[i];
        if (A == B) {
            continue;
        }
        const pd = await findQinmidu(A, B);
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
