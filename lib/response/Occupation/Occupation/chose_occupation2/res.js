import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?转换副职$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usrId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(usrId);
    if (!player) {
        return false;
    }
    const action = await getDataJSONParseByKey(keys.fuzhi(usrId));
    if (!action) {
        return;
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
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
