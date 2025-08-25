import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { existNajieThing } from '../../../../model/najie.js';
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
import { LevelMax_up } from '../level.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?幸运破体$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const x = await existNajieThing(usr_qq, '幸运草', '道具');
    if (!x) {
        Send(Text('醒醒，你没有道具【幸运草】!'));
        return false;
    }
    LevelMax_up(e, true);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
