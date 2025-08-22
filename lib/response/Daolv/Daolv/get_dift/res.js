import { useSend, useMention, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { findQinmidu, fstaddQinmidu, addQinmidu } from '../../../../model/qinmidu.js';
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
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?^赠予百合花篮$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    const B = User.UserId;
    const A = e.UserId;
    const ifexistplay = await existplayer(A);
    if (!ifexistplay)
        return false;
    if (A == B) {
        Send(Text('精神分裂?'));
        return false;
    }
    const ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const ishavejz = await existNajieThing(A, '百合花篮', '道具');
    if (!ishavejz) {
        Send(Text('你没有[百合花篮]'));
        return false;
    }
    const pd = await findQinmidu(A, B);
    if (pd === false) {
        await fstaddQinmidu(A, B);
    }
    else if (pd == 0) {
        Send(Text(`对方已有道侣`));
        return false;
    }
    await addQinmidu(A, B, 60);
    await addNajieThing(A, '百合花篮', '道具', -1);
    Send(Text(`你们的亲密度增加了60`));
});

export { res as default, regular };
