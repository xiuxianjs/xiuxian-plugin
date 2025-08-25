import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
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

const regular = /^(#|＃|\/)?供奉神石$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const x = await existNajieThing(usr_qq, '神石', '道具');
    if (!x) {
        Send(Text('你没有神石'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你尝试供奉神石,但是失败了'));
        return false;
    }
    player.神石 += x;
    await writePlayer(usr_qq, player);
    Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'));
    await addNajieThing(usr_qq, '神石', '道具', -x);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
