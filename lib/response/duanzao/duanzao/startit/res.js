import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { looktripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/DataList.js';
import { readDanyao, writeDanyao } from '../../../../model/danyao.js';
import 'dayjs';
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
import { setValue, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../route/core/auth.js';
import { readActionWithSuffix, isActionRunning, formatRemaining, remainingMs, startActionWithSuffix } from '../../../../model/actionHelper.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?开始炼制/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const A = await looktripod(userId);
    if (A !== 1) {
        void Send(Text('请先去#炼器师能力评测,再来锻造吧'));
        return false;
    }
    let newtripod = [];
    try {
        newtripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (const item of newtripod) {
        if (userId === item.qq) {
            if (item.材料.length === 0) {
                void Send(Text('炉子为空,无法炼制'));
                return false;
            }
            const action = await readActionWithSuffix(userId, 'action10');
            if (isActionRunning(action)) {
                void Send(Text(`正在${action.action}中，剩余时间:${formatRemaining(remainingMs(action))}`));
                return false;
            }
            item.状态 = 1;
            item.TIME = Date.now();
            await writeDuanlu(newtripod);
            const action_time = 180 * 60 * 1000;
            const arr = await startActionWithSuffix(userId, 'action10', '锻造', action_time, {});
            const dy = await readDanyao(userId);
            if (dy.xingyun >= 1) {
                dy.xingyun--;
                if (dy.xingyun === 0) {
                    dy.beiyong5 = 0;
                }
            }
            await writeDanyao(userId, dy);
            await setValue(userKey(userId, 'action10'), arr);
            void Send(Text('现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间'));
            return false;
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
