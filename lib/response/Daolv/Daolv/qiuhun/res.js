import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { existplayer, findQinmidu, existNajieThing, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Daolv, chaoshi } from '../daolv.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(结为道侣)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A = e.UserId;
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return false;
    }
    let A_action = await redis.get('xiuxian@1.3.0:' + A + ':action');
    A_action = JSON.parse(A_action);
    if (A_action != null) {
        let now_time = new Date().getTime();
        let A_action_end_time = A_action.end_time;
        if (now_time <= A_action_end_time) {
            let m = Math.floor((A_action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((A_action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + A_action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let last_game_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_game_time');
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
    let B = User.UserId;
    if (A == B) {
        Send(Text('精神分裂?'));
        return false;
    }
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    let B_action = await redis.get('xiuxian@1.3.0:' + B + ':action');
    B_action = JSON.parse(B_action);
    if (B_action != null) {
        let now_time = new Date().getTime();
        let B_action_end_time = B_action.end_time;
        if (now_time <= B_action_end_time) {
            let m = Math.floor((B_action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((B_action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let last_game_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_game_time');
    if (+last_game_timeB == 0) {
        Send(Text(`对方猜大小正在进行哦，等他结束再求婚吧!`));
        return false;
    }
    let pd = await findQinmidu(A, B);
    let ishavejz = await existNajieThing(A, '定情信物', '道具');
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
    let player_A = await readPlayer(A);
    let msg = ['\n'];
    msg.push(`${player_A.名号}想和你缔结道侣,你愿意吗？\n回复【我愿意】or【我拒绝】`);
    Send(Text(msg.join('\n')));
    chaoshi(e);
});

export { res as default, regular };
