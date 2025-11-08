import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysAction } from '../../../../model/keys.js';
import { delDataByKey } from '../../../../model/DataControl.js';
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
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?解封.*$/;
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
    const ifexistplay = await existplayer(qq);
    if (!ifexistplay) {
        return;
    }
    void delDataByKey(keysAction.gameAction(qq));
    void delDataByKey(keysAction.action(qq));
    void Send(Text('已强制解除'));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
