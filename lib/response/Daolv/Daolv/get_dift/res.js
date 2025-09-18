import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { findQinmidu, fstaddQinmidu, existHunyin, addQinmidu } from '../../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?^赠予百合花篮$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const B = target.UserId;
    const A = e.UserId;
    const ifexistplay = await existplayer(A);
    if (!ifexistplay) {
        return false;
    }
    if (A === B) {
        void Send(Text('精神分裂?'));
        return false;
    }
    const ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        void Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const ishavejz = await existNajieThing(A, '百合花篮', '道具');
    if (!ishavejz) {
        void Send(Text('你没有[百合花篮]'));
        return false;
    }
    const pd = await findQinmidu(A, B);
    if (pd === false) {
        await fstaddQinmidu(A, B);
    }
    else if (pd === 0) {
        const existHunyinA = await existHunyin(A);
        if (existHunyinA !== B) {
            void Send(Text('对方已有道侣'));
            return false;
        }
    }
    await addQinmidu(A, B, 60);
    await addNajieThing(A, '百合花篮', '道具', -1);
    void Send(Text('你们的亲密度增加了60'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
