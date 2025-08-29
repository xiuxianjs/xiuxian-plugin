import { useSend, useMention, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { userKey } from '../../../../model/utils/redisHelper.js';
import { readAction, stopAction } from '../../../../model/actionHelper.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?解封.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster) {
            return false;
        }
        const [mention] = useMention(e);
        const res = await mention.findOne();
        const target = res?.data;
        if (!target || res.code !== 2000) {
            return false;
        }
        const qq = target.UserId;
        const ifexistplay = await existplayer(qq);
        if (!ifexistplay) {
            return false;
        }
        await redis.del(userKey(qq, 'game_action'));
        const record = await readAction(qq);
        if (record) {
            await stopAction(qq, {
                is_jiesuan: 1,
                shutup: '1',
                working: '1',
                power_up: '1',
                Place_action: '1',
                Place_actionplus: '1'
            });
            void Send(Text('已解除！'));
            return false;
        }
        void Send(Text('不需要解除！'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
