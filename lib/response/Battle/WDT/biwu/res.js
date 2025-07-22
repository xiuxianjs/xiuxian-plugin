import { useSend, Text, useMention } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import { existplayer, Read_player, isNotNull, exist_najie_thing, zd_battle, Add_HP, Add_血气 as Add___, Add_灵石 as Add___$1 } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)^比武$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A = e.UserId;
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return;
    }
    let last_game_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_game_time');
    if (+last_game_timeA == 0) {
        Send(Text(`猜大小正在进行哦!`));
        return true;
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
        return;
    }
    let playerAA = await Read_player(A);
    let now_level_idAA;
    if (!isNotNull(playerAA.level_id)) {
        Send(Text('请先#同步信息'));
        return;
    }
    now_level_idAA = data.Level_list.find(item => item.level_id == playerAA.level_id).level_id;
    let playerBB = await Read_player(B);
    let now_level_idBB;
    if (!isNotNull(playerBB.level_id)) {
        Send(Text('对方为错误存档！'));
        return;
    }
    now_level_idBB = data.Level_list.find(item => item.level_id == playerBB.level_id).level_id;
    if (A == B) {
        Send(Text('咋的，自娱自乐？'));
        return;
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
            return;
        }
    }
    let last_game_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_game_time');
    if (+last_game_timeB == 0) {
        Send(Text(`对方猜大小正在进行哦，等他结束再来比武吧!`));
        return true;
    }
    let B_action_res = await redis.get('xiuxian@1.3.0:' + B + ':action');
    const B_action = JSON.parse(B_action_res);
    if (B_action != null) {
        let now_time = new Date().getTime();
        let B_action_end_time = B_action.end_time;
        if (now_time <= B_action_end_time) {
            let ishaveyss = await exist_najie_thing(A, '剑xx', '道具');
            if (!ishaveyss) {
                let m = Math.floor((B_action_end_time - now_time) / 1000 / 60);
                let s = Math.floor((B_action_end_time - now_time - m * 60 * 1000) / 1000);
                Send(Text('对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'));
                return;
            }
        }
    }
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let now = new Date();
    let nowTime = now.getTime();
    let last_biwu_time = await redis.get('xiuxian@1.3.0:' + A + ':last_biwu_time');
    last_biwu_time = parseInt(last_biwu_time);
    let robTimeout = Math.floor(60000 * cf.CD.biwu);
    if (nowTime < last_biwu_time + robTimeout) {
        let waittime_m = Math.trunc((last_biwu_time + robTimeout - nowTime) / 60 / 1000);
        let waittime_s = Math.trunc(((last_biwu_time + robTimeout - nowTime) % 60000) / 1000);
        Send(Text('比武正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`));
        return;
    }
    let B_player = await Read_player(B);
    let A_player = await Read_player(A);
    let Time = cf.CD.couple;
    let shuangxiuTimeout = Math.floor(60000 * Time);
    let now_Time = new Date().getTime();
    let last_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_biwu_time');
    last_timeA = parseInt(last_timeA);
    if (now_Time < last_timeA + shuangxiuTimeout) {
        let Couple_m = Math.trunc((last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000);
        let Couple_s = Math.trunc(((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text(`比武冷却:  ${Couple_m}分 ${Couple_s}秒`));
        return;
    }
    let last_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_biwu_time');
    last_timeB = parseInt(last_timeB);
    if (now_Time < last_timeB + shuangxiuTimeout) {
        let Couple_m = Math.trunc((last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000);
        let Couple_s = Math.trunc(((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text(`对方比武冷却:  ${Couple_m}分 ${Couple_s}秒`));
        return;
    }
    if (B_player.当前血量 <= B_player.血量上限 / 1.2) {
        Send(Text(`${B_player.名号} 血量未满，不能趁人之危哦`));
        return;
    }
    if (A_player.当前血量 <= A_player.血量上限 / 1.2) {
        Send(Text(`你血量未满，对方不想趁人之危`));
        return;
    }
    let final_msg = [];
    await redis.set('xiuxian@1.3.0:' + A + ':last_biwu_time', now_Time);
    await redis.set('xiuxian@1.3.0:' + B + ':last_biwu_time', now_Time);
    final_msg.push(`${A_player.名号}向${B_player.名号}发起了比武！`);
    A_player.法球倍率 = A_player.灵根.法球倍率;
    B_player.法球倍率 = B_player.灵根.法球倍率;
    let Data_battle = await zd_battle(A_player, B_player);
    let msg = Data_battle.msg;
    if (msg.length > 35) {
        console.log('通过');
    }
    else {
        Send(Text(msg));
    }
    await Add_HP(A, Data_battle.A_xue);
    await Add_HP(B, Data_battle.B_xue);
    let A_win = `${A_player.名号}击败了${B_player.名号}`;
    let B_win = `${B_player.名号}击败了${A_player.名号}`;
    if (msg.find(item => item == A_win)) {
        let qixue = Math.trunc(1000 * now_level_idBB);
        let qixue2 = Math.trunc(500 * now_level_idAA);
        let JL = Math.trunc(10 * now_level_idAA);
        await Add___(A, qixue);
        await Add___(B, qixue2);
        await Add___$1(A, JL);
        await Add___$1(B, JL);
        let A_player = await Read_player(A);
        A_player.魔道值 += 1;
        data.setData('player', A, A_player);
        final_msg.push(` 经过一番大战,${A_win}获得了胜利,${A_player.名号}获得${qixue}气血，${B_player.名号}获得${qixue2}气血，双方都获得了${JL}的灵石。`);
    }
    else if (msg.find(item => item == B_win)) {
        let qixue = Math.trunc(500 * now_level_idBB);
        let qixue2 = Math.trunc(1000 * now_level_idAA);
        let JL = Math.trunc(10 * now_level_idAA);
        await Add___(A, qixue);
        await Add___(B, qixue2);
        await Add___$1(A, JL);
        await Add___$1(B, JL);
        let B_player = await Read_player(B);
        B_player.魔道值 += 1;
        data.setData('player', playerBB, B_player);
        final_msg.push(`经过一番大战,${B_win}获得了胜利,${B_player.名号}获得${qixue2}气血，${A_player.名号}获得${qixue}气血，双方都获得了${JL}的灵石。`);
    }
    else {
        Send(Text(`战斗过程出错`));
        return;
    }
    Send(Text(final_msg.join('')));
    await redis.set('xiuxian@1.3.0:' + A + ':last_biwu_time', nowTime);
});

export { res as default, name, regular, selects };
