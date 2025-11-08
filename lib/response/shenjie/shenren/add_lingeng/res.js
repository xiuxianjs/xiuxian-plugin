import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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
import 'dayjs';
import 'buffer';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?供奉神石$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const x = await existNajieThing(userId, '神石', '道具');
    if (!x) {
        void Send(Text('你没有神石'));
        return false;
    }
    const player = await readPlayer(userId);
    if (player.魔道值 > 0 || (player.灵根.type !== '转生' && player.level_id < 42)) {
        void Send(Text('你尝试供奉神石,但是失败了'));
        return false;
    }
    player.神石 += x;
    await writePlayer(userId, player);
    void Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'));
    await addNajieThing(userId, '神石', '道具', -x);
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
