import { useSend, Text, Image } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
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
import { readTiandibang, Write_tiandibang, get_tianditang_img } from '../tian.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?天地堂/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    let m = tiandibang.length;
    for (m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq == usr_qq) {
            break;
        }
    }
    if (m == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    const img = await get_tianditang_img(e, tiandibang[m].积分);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
