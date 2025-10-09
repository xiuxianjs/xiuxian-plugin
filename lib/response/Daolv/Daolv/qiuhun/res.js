import { getRedisKey } from '../../../../model/keys.js';
import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { readAction, isActionRunning, formatRemaining, remainingMs } from '../../../../model/actionHelper.js';
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
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { findQinmidu } from '../../../../model/qinmidu.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { Daolv, chaoshi } from '../daolv.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?^(结为道侣)$/;
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
    if (last_game_timeB !== null && +last_game_timeB === 0) {
        void Send(Text('对方猜大小正在进行哦，等他结束再求婚吧!'));
        return false;
    }
    let pd = await findQinmidu(A, B);
    const ishavejz = await existNajieThing(A, '定情信物', '道具');
    if (!ishavejz) {
        void Send(Text('你没有[定情信物],无法发起求婚'));
        return false;
    }
    else if (pd === false || (pd > 0 && pd < 500)) {
        if (pd === false) {
            pd = 0;
        }
        void Send(Text(`你们亲密度不足500,无法心意相通(当前亲密度${pd})`));
        return false;
    }
    else if (pd === 0) {
        void Send(Text('对方已有道侣'));
        return false;
    }
    if (Daolv.x === 1 || Daolv.x === 2) {
        void Send(Text('有人缔结道侣，请稍等'));
        return false;
    }
    Daolv.set_x(1);
    Daolv.set_user_A(A);
    Daolv.set_user_B(B);
    const player_A = await readPlayer(A);
    const msg = ['\n'];
    msg.push(`${player_A.名号}想和你缔结道侣,你愿意吗？\n回复【我愿意】or【我拒绝】`);
    void Send(Text(msg.join('\n')));
    chaoshi(e);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
