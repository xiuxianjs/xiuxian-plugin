import { useSend, Text } from 'alemonjs';
import { setValue, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { stopActionWithSuffix } from '../../../../model/actionHelper.js';
import '../../../../model/api.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { looktripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?清空锻炉/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const A = await looktripod(userId);
    if (A === 1) {
        const newtripod = await readTripod();
        for (const item of newtripod) {
            if (userId === item.qq) {
                item.材料 = [];
                item.数量 = [];
                item.TIME = 0;
                item.时长 = 30000;
                item.状态 = 0;
                item.预计时长 = 0;
                await writeDuanlu(newtripod);
                await stopActionWithSuffix(userId, 'action10');
                await setValue(userKey(userId, 'action10'), null);
                void Send(Text('材料成功清除'));
                return false;
            }
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
