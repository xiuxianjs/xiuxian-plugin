import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { readAction, isActionRunning, formatRemaining, remainingMs } from '../../../actionHelper.js';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/XiuxianData.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { existNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { findQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { Daolv, chaoshi } from '../daolv.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(结为道侣)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A = e.UserId;
    const ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return false;
    }
    const A_action = await readAction(A);
    if (isActionRunning(A_action)) {
        Send(Text(`正在${A_action.action}中,剩余时间:${formatRemaining(remainingMs(A_action))}`));
        return false;
    }
    const last_game_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_game_time');
    if (+last_game_timeA == 0) {
        Send(Text(`猜大小正在进行哦，结束了再求婚吧!`));
        return false;
    }
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    const B = User.UserId;
    if (A == B) {
        Send(Text('精神分裂?'));
        return false;
    }
    const ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const B_action = await readAction(B);
    if (isActionRunning(B_action)) {
        Send(Text(`对方正在${B_action.action}中,剩余时间:${formatRemaining(remainingMs(B_action))}`));
        return false;
    }
    const last_game_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_game_time');
    if (+last_game_timeB == 0) {
        Send(Text(`对方猜大小正在进行哦，等他结束再求婚吧!`));
        return false;
    }
    let pd = await findQinmidu(A, B);
    const ishavejz = await existNajieThing(A, '定情信物', '道具');
    if (!ishavejz) {
        Send(Text('你没有[定情信物],无法发起求婚'));
        return false;
    }
    else if (pd == false || (pd > 0 && pd < 500)) {
        if (pd == false)
            pd = 0;
        Send(Text(`你们亲密度不足500,无法心意相通(当前亲密度${pd})`));
        return false;
    }
    else if (pd == 0) {
        Send(Text(`对方已有道侣`));
        return false;
    }
    if (Daolv.x == 1 || Daolv.x == 2) {
        Send(Text(`有人缔结道侣，请稍等`));
        return false;
    }
    Daolv.set_x(1);
    Daolv.set_user_A(A);
    Daolv.set_user_B(B);
    const player_A = await readPlayer(A);
    const msg = ['\n'];
    msg.push(`${player_A.名号}想和你缔结道侣,你愿意吗？\n回复【我愿意】or【我拒绝】`);
    Send(Text(msg.join('\n')));
    chaoshi(e);
});

export { res as default, regular };
