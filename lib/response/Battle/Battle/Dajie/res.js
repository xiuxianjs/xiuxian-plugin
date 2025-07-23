import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player, isNotNull, exist_najie_thing, Add_najie_thing, zd_battle, Add_HP } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^打劫$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const nowDate = new Date();
    const todayDate = new Date(nowDate);
    const { openHour, closeHour } = config.getConfig('xiuxian', 'xiuxian');
    const todayTime = todayDate.setHours(0, 0, 0, 0);
    const openTime = todayTime + openHour * 60 * 60 * 1000;
    const nowTime1 = nowDate.getTime();
    const closeTime = todayTime + closeHour * 60 * 60 * 1000;
    if (!(nowTime1 < openTime || nowTime1 > closeTime)) {
        Send(Text(`这个时间由星阁阁主看管,还是不要张扬较好`));
        return false;
    }
    let A = e.UserId;
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return false;
    }
    let last_game_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_game_time');
    if (+last_game_timeA == 0) {
        Send(Text(`猜大小正在进行哦!`));
        return false;
    }
    const Mentions = (await useMention(e)[0].findOne()).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    let B = User.UserId;
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('不可对凡人出手!'));
        return false;
    }
    let playerAA = await Read_player(A);
    let now_level_idAA;
    if (!isNotNull(playerAA.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    now_level_idAA = data.Level_list.find(item => item.level_id == playerAA.level_id).level_id;
    let playerBB = await Read_player(B);
    let now_level_idBB;
    if (!isNotNull(playerBB.level_id)) {
        Send(Text('对方为错误存档！'));
        return false;
    }
    now_level_idBB = data.Level_list.find(item => item.level_id == playerBB.level_id).level_id;
    if (now_level_idAA > 41 && now_level_idBB <= 41) {
        Send(Text(`仙人不可对凡人出手！`));
        return false;
    }
    if (now_level_idAA >= 12 && now_level_idBB < 12) {
        Send(Text(`不可欺负弱小！`));
        return false;
    }
    if (A == B) {
        Send(Text('咋的，自己弄自己啊？'));
        return false;
    }
    let playerA = data.getData('player', A);
    let playerB = data.getData('player', B);
    if (isNotNull(playerA.宗门) && isNotNull(playerB.宗门)) {
        let assA = data.getAssociation(playerA.宗门.宗门名称);
        let assB = data.getAssociation(playerB.宗门.宗门名称);
        if (assA.宗门名称 == assB.宗门名称) {
            Send(Text('门派禁止内讧'));
            return false;
        }
    }
    let A_action_res = await redis.get('xiuxian@1.3.0:' + A + ':action');
    const A_action = JSON.parse(A_action_res);
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
    let last_game_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_game_time');
    if (+last_game_timeB == 0) {
        Send(Text(`对方猜大小正在进行哦，等他赚够了再打劫也不迟!`));
        return false;
    }
    let isBbusy = false;
    let B_action_res = await redis.get('xiuxian@1.3.0:' + B + ':action');
    const B_action = JSON.parse(B_action_res);
    if (B_action != null) {
        let now_time = new Date().getTime();
        let B_action_end_time = B_action.end_time;
        if (now_time <= B_action_end_time) {
            isBbusy = true;
            let ishaveyss = await exist_najie_thing(A, '隐身水', '道具');
            if (!ishaveyss) {
                let m = Math.floor((B_action_end_time - now_time) / 1000 / 60);
                let s = Math.floor((B_action_end_time - now_time - m * 60 * 1000) / 1000);
                Send(Text('对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'));
                return false;
            }
        }
    }
    let now = new Date();
    let nowTime = now.getTime();
    let last_dajie_time = await redis.get('xiuxian@1.3.0:' + A + ':last_dajie_time');
    last_dajie_time = parseInt(last_dajie_time);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let robTimeout = Math.floor(60000 * cf.CD.rob);
    if (nowTime < last_dajie_time + robTimeout) {
        let waittime_m = Math.trunc((last_dajie_time + robTimeout - nowTime) / 60 / 1000);
        let waittime_s = Math.trunc(((last_dajie_time + robTimeout - nowTime) % 60000) / 1000);
        Send(Text('打劫正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`));
        return false;
    }
    let A_player = await Read_player(A);
    let B_player = await Read_player(B);
    if (A_player.修为 < 0) {
        Send(Text(`还是闭会关再打劫吧`));
        return false;
    }
    if (B_player.当前血量 < 20000) {
        Send(Text(`${B_player.名号} 重伤未愈,就不要再打他了`));
        return false;
    }
    if (B_player.灵石 < 30002) {
        Send(Text(`${B_player.名号} 穷得快赶上水脚脚了,就不要再打他了`));
        return false;
    }
    let final_msg = [];
    if (isBbusy) {
        final_msg.push(`${B_player.名号}正在${B_action.action}，${A_player.名号}利用隐身水悄然接近，但被发现。`);
        await Add_najie_thing(A, '隐身水', '道具', -1);
    }
    else {
        final_msg.push(`${A_player.名号}向${B_player.名号}发起了打劫。`);
    }
    await redis.set('xiuxian@1.3.0:' + A + ':last_dajie_time', nowTime);
    A_player.法球倍率 = A_player.灵根.法球倍率;
    B_player.法球倍率 = B_player.灵根.法球倍率;
    let Data_battle = await zd_battle(A_player, B_player);
    let msg = Data_battle.msg;
    if (msg.length > 35) ;
    else {
        Send(Text(msg));
    }
    await Add_HP(A, Data_battle.A_xue);
    await Add_HP(B, Data_battle.B_xue);
    let A_win = `${A_player.名号}击败了${B_player.名号}`;
    let B_win = `${B_player.名号}击败了${A_player.名号}`;
    if (msg.find(item => item == A_win)) {
        if ((await exist_najie_thing(B, '替身人偶', '道具')) &&
            B_player.魔道值 < 1 &&
            (B_player.灵根.type == '转生' || B_player.level_id > 41)) {
            Send(Text(B_player.名号 + '使用了道具替身人偶,躲过了此次打劫'));
            await Add_najie_thing(B, '替身人偶', '道具', -1);
            return false;
        }
        let mdzJL = A_player.魔道值;
        let lingshi = Math.trunc(B_player.灵石 / 5);
        let qixue = Math.trunc(100 * now_level_idAA);
        let mdz = Math.trunc(lingshi / 10000);
        if (lingshi >= B_player.灵石) {
            lingshi = B_player.灵石 / 2;
        }
        A_player.灵石 += lingshi;
        B_player.灵石 -= lingshi;
        A_player.血气 += qixue;
        A_player.魔道值 += mdz;
        A_player.灵石 += mdzJL;
        await Write_player(A, A_player);
        await Write_player(B, B_player);
        final_msg.push(` 经过一番大战,${A_win},成功抢走${lingshi}灵石,${A_player.名号}获得${qixue}血气，`);
    }
    else if (msg.find(item => item == B_win)) {
        if (A_player.灵石 < 30002) {
            let qixue = Math.trunc(100 * now_level_idBB);
            B_player.血气 += qixue;
            await Write_player(B, B_player);
            let time2 = 60;
            let action_time2 = 60000 * time2;
            let action2 = await redis.get('xiuxian@1.3.0:' + A + ':action');
            action2 = await JSON.parse(action2);
            action2.action = '禁闭';
            action2.end_time = new Date().getTime() + action_time2;
            await redis.set('xiuxian@1.3.0:' + A + ':action', JSON.stringify(action2));
            final_msg.push(`经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被关禁闭60分钟`);
        }
        else {
            let lingshi = Math.trunc(A_player.灵石 / 4);
            let qixue = Math.trunc(100 * now_level_idBB);
            if (lingshi <= 0) {
                lingshi = 0;
            }
            A_player.灵石 -= lingshi;
            B_player.灵石 += lingshi;
            B_player.血气 += qixue;
            await Write_player(A, A_player);
            await Write_player(B, B_player);
            final_msg.push(`经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被劫走${lingshi}灵石`);
        }
    }
    else {
        Send(Text(`战斗过程出错`));
        return false;
    }
    Send(Text(final_msg.join('')));
});

export { res as default, regular };
