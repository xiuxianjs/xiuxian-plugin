import { getRedisKey } from '../../../../model/keys.js';
import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { readAction, isActionRunning, formatRemaining, remainingMs } from '../../../../model/actionHelper.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { readQinmidu, writeQinmidu, findQinmidu } from '../../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { found, Daolv, chaoshi } from '../daolv.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?^(断绝姻缘)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A = e.UserId;
    const ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return false;
    }
    const A_action = await readAction(A);
    if (isActionRunning(A_action)) {
        void Send(Text(`正在${A_action?.action}中,剩余时间:${formatRemaining(remainingMs(A_action))}`));
        return false;
    }
    const last_game_timeA = await redis.get(getRedisKey(A, 'last_game_time'));
    if (+last_game_timeA === 0) {
        void Send(Text('猜大小正在进行哦，结束了再来吧!'));
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const B = target.UserId;
    if (A === B) {
        void Send(Text('精神分裂?'));
        return false;
    }
    const ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        void Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const B_action = await readAction(B);
    if (isActionRunning(B_action)) {
        void Send(Text(`对方正在${B_action.action}中,剩余时间:${formatRemaining(remainingMs(B_action))}`));
        return false;
    }
    const last_game_timeB = await redis.get(getRedisKey(B, 'last_game_time'));
    if (+last_game_timeB === 0) {
        void Send(Text('对方猜大小正在进行哦，等他结束再找他吧!'));
        return false;
    }
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    const i = await found(A, B);
    const pd = await findQinmidu(A, B);
    if (pd === false) {
        void Send(Text('你们还没建立关系，断个锤子'));
        return false;
    }
    else if (qinmidu[i].婚姻 === 0) {
        void Send(Text('你们还没结婚，断个锤子'));
        return false;
    }
    if (Daolv.x === 1 || Daolv.x === 2) {
        void Send(Text('有人正在缔结道侣，请稍等'));
        return false;
    }
    Daolv.set_x(2);
    Daolv.set_user_A(A);
    Daolv.set_user_B(B);
    const player_A = await readPlayer(A);
    const msg = ['\n'];
    msg.push(`${player_A.名号}要和你断绝姻缘\n回复【我同意】or【我拒绝】`);
    void Send(Text(msg.join('')));
    chaoshi(e);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
