import { useSend, useMention, Text } from 'alemonjs';
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
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|\/)打落凡间.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return;
    }
    const qq = target.UserId;
    const player = await readPlayer(qq);
    if (!player) {
        void Send(Text('对方未踏入仙途'));
        return;
    }
    player.power_place = 1;
    void writePlayer(qq, player);
    void Send(Text('已打落凡间！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
