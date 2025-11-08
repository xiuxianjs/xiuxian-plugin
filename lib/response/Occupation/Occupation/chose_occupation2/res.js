import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
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
import { Go } from '../../../../model/common.js';
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
import { withLock } from '../../../../model/locks.js';

const regular = /^(#|＃|\/)?转换副职$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usrId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const lockKey = `occupation_convert:${usrId}`;
    const result = await withLock(lockKey, async () => {
        const player = await readPlayer(usrId);
        if (!player) {
            return false;
        }
        const action = await getDataJSONParseByKey(keys.fuzhi(usrId));
        if (!action) {
            return false;
        }
        const a = action.职业名;
        const b = action.职业经验;
        const c = action.职业等级;
        action.职业名 = player.occupation;
        action.职业经验 = player.occupation_exp;
        action.职业等级 = player.occupation_level;
        player.occupation = a;
        player.occupation_exp = b;
        player.occupation_level = c;
        await setDataJSONStringifyByKey(keys.fuzhi(usrId), action);
        await writePlayer(usrId, player);
        void Send(Text(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`));
        return true;
    }, { timeout: 5000, retryDelay: 100, maxRetries: 0 });
    if (!result.success) {
        void Send(Text('正在进行职业转换，请稍后再试'));
        return false;
    }
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
