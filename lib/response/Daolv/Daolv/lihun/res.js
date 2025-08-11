import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { readAction, isActionRunning, formatRemaining, remainingMs } from '../../../actionHelper.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { readQinmidu, writeQinmidu, findQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { found, Daolv, chaoshi } from '../daolv.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(断绝姻缘)$/;
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
        Send(Text(`猜大小正在进行哦，结束了再来吧!`));
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
        Send(Text(`对方猜大小正在进行哦，等他结束再找他吧!`));
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
    if (pd == false) {
        Send(Text('你们还没建立关系，断个锤子'));
        return false;
    }
    else if (qinmidu[i].婚姻 == 0) {
        Send(Text('你们还没结婚，断个锤子'));
        return false;
    }
    if (Daolv.x == 1 || Daolv.x == 2) {
        Send(Text(`有人正在缔结道侣，请稍等`));
        return false;
    }
    Daolv.set_x(2);
    Daolv.set_user_A(A);
    Daolv.set_user_B(B);
    const player_A = await readPlayer(A);
    const msg = ['\n'];
    msg.push(`${player_A.名号}要和你断绝姻缘\n回复【我同意】or【我拒绝】`);
    Send(Text(msg.join('')));
    chaoshi(e);
});

export { res as default, regular };
