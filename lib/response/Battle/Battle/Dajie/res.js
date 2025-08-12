import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addHP } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { zdBattle } from '../../../../model/battle.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/equipment.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';
import { getDataByUserId } from '../../../../model/Redis.js';

const regular = /^(#|＃|\/)?打劫$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function extractFaQiu(lg) {
    if (!lg || typeof lg !== 'object')
        return undefined;
    const v = lg.法球倍率;
    return typeof v === 'number' ? v : undefined;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const nowDate = new Date();
    const { openHour, closeHour } = config.getConfig('xiuxian', 'xiuxian');
    const openH = typeof openHour === 'number' ? openHour : 20;
    const closeH = typeof closeHour === 'number' ? closeHour : 22;
    const day0 = new Date(nowDate);
    const dayTs = day0.setHours(0, 0, 0, 0);
    const openTime = dayTs + openH * 3600 * 1000;
    const closeTime = dayTs + closeH * 3600 * 1000;
    const nowTs = nowDate.getTime();
    if (nowTs >= openTime && nowTs <= closeTime) {
        Send(Text('这个时间由星阁阁主看管,还是不要张扬较好'));
        return false;
    }
    const A = e.UserId;
    if (!(await existplayer(A)))
        return false;
    const last_game_timeA = await redis.get(`xiuxian@1.3.0:${A}:last_game_time`);
    if (last_game_timeA && Number(last_game_timeA) === 0) {
        Send(Text('猜大小正在进行哦!'));
        return false;
    }
    const mentionsApi = useMention(e)[0];
    const Mentions = (await mentionsApi.find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0)
        return false;
    const target = Mentions.find(m => !m.IsBot);
    if (!target)
        return false;
    const B = target.UserId;
    if (A === B) {
        Send(Text('咋的，自己弄自己啊？'));
        return false;
    }
    if (!(await existplayer(B))) {
        Send(Text('不可对凡人出手!'));
        return false;
    }
    const playerAA = await readPlayer(A);
    if (!notUndAndNull(playerAA.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    const levelA = data.Level_list.find(it => it.level_id === playerAA.level_id);
    if (!levelA) {
        Send(Text('你的境界数据异常'));
        return false;
    }
    const now_level_idAA = levelA.level_id;
    const playerBB = await readPlayer(B);
    if (!notUndAndNull(playerBB.level_id)) {
        Send(Text('对方为错误存档！'));
        return false;
    }
    const levelB = data.Level_list.find(it => it.level_id === playerBB.level_id);
    if (!levelB) {
        Send(Text('对方境界数据异常'));
        return false;
    }
    const now_level_idBB = levelB.level_id;
    if (now_level_idAA > 41 && now_level_idBB <= 41) {
        Send(Text('仙人不可对凡人出手！'));
        return false;
    }
    if (now_level_idAA >= 12 && now_level_idBB < 12) {
        Send(Text('不可欺负弱小！'));
        return false;
    }
    const playerAFull = (await data.getData('player', A));
    const playerBFull = (await data.getData('player', B));
    if (playerAFull?.宗门 &&
        playerBFull?.宗门 &&
        isPlayerGuildRef(playerAFull.宗门) &&
        isPlayerGuildRef(playerBFull.宗门)) {
        const assA = await data.getAssociation(playerAFull.宗门.宗门名称);
        const assB = await data.getAssociation(playerBFull.宗门.宗门名称);
        if (assA !== 'error' &&
            assB !== 'error' &&
            isExtAss(assA) &&
            isExtAss(assB) &&
            assA.宗门名称 === assB.宗门名称) {
            Send(Text('门派禁止内讧'));
            return false;
        }
    }
    try {
        const A_action_res = await getDataByUserId(A, 'action');
        if (A_action_res) {
            const A_action = JSON.parse(A_action_res);
            if (A_action && typeof A_action === 'object' && 'end_time' in A_action) {
                const end = Number(A_action.end_time);
                if (!Number.isNaN(end) && Date.now() <= end) {
                    const remain = end - Date.now();
                    const m = Math.floor(remain / 60000);
                    const s = Math.floor((remain % 60000) / 1000);
                    Send(Text(`正在${A_action.action}中,剩余时间:${m}分${s}秒`));
                    return false;
                }
            }
        }
    }
    catch {
    }
    const last_game_timeB = await redis.get(`xiuxian@1.3.0:${B}:last_game_time`);
    if (last_game_timeB && Number(last_game_timeB) === 0) {
        Send(Text('对方猜大小正在进行哦，等他赚够了再打劫也不迟!'));
        return false;
    }
    let isBbusy = false;
    let B_action = null;
    try {
        const B_action_res = await redis.get(`xiuxian@1.3.0:${B}:action`);
        if (B_action_res) {
            B_action = JSON.parse(B_action_res);
            if (B_action && Date.now() <= Number(B_action.end_time)) {
                isBbusy = true;
                const haveYSS = await existNajieThing(A, '隐身水', '道具');
                if (!haveYSS) {
                    const remain = Number(B_action.end_time) - Date.now();
                    const m = Math.floor(remain / 60000);
                    const s = Math.floor((remain % 60000) / 1000);
                    Send(Text(`对方正在${B_action.action}中,剩余时间:${m}分${s}秒`));
                    return false;
                }
            }
        }
    }
    catch {
    }
    const last_dajie_time_raw = await redis.get(`xiuxian@1.3.0:${A}:last_dajie_time`);
    const last_dajie_time = Number(last_dajie_time_raw) || 0;
    const cfgAuction = config.getConfig('xiuxian', 'xiuxian');
    const robCdMin = cfgAuction?.CD?.rob ?? 10;
    const robTimeout = Math.floor(robCdMin * 60000);
    if (Date.now() < last_dajie_time + robTimeout) {
        const remain = last_dajie_time + robTimeout - Date.now();
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        Send(Text(`打劫正在CD中，剩余cd:  ${m}分 ${s}秒`));
        return false;
    }
    const A_player = await readPlayer(A);
    const B_player = await readPlayer(B);
    if (A_player.修为 < 0) {
        Send(Text('还是闭会关再打劫吧'));
        return false;
    }
    if (B_player.当前血量 < 20000) {
        Send(Text(`${B_player.名号} 重伤未愈,就不要再打他了`));
        return false;
    }
    if (B_player.灵石 < 30002) {
        Send(Text(`${B_player.名号} 太穷了,就不要再打他了`));
        return false;
    }
    const final_msg = [];
    if (isBbusy) {
        final_msg.push(`${B_player.名号}正在${B_action?.action}，${A_player.名号}利用隐身水悄然接近，但被发现。`);
        await addNajieThing(A, '隐身水', '道具', -1);
    }
    else {
        final_msg.push(`${A_player.名号}向${B_player.名号}发起了打劫。`);
    }
    await redis.set(`xiuxian@1.3.0:${A}:last_dajie_time`, String(Date.now()));
    const faA = extractFaQiu(A_player.灵根);
    if (faA !== undefined)
        A_player.法球倍率 = faA;
    const faB = extractFaQiu(B_player.灵根);
    if (faB !== undefined)
        B_player.法球倍率 = faB;
    A_player.当前血量 = A_player.血量上限;
    B_player.当前血量 = B_player.血量上限;
    let battle;
    try {
        battle = await zdBattle(A_player, B_player);
    }
    catch {
        Send(Text('战斗过程出错'));
        return false;
    }
    const msgArr = Array.isArray(battle.msg) ? battle.msg : [];
    if (msgArr.length <= 35) {
        Send(Text(msgArr.join('\n')));
    }
    await addHP(A, battle.A_xue);
    await addHP(B, battle.B_xue);
    const A_win = `${A_player.名号}击败了${B_player.名号}`;
    const B_win = `${B_player.名号}击败了${A_player.名号}`;
    if (msgArr.includes(A_win)) {
        const hasDoll = await existNajieThing(B, '替身人偶', '道具');
        if (hasDoll &&
            B_player.魔道值 < 1 &&
            (B_player.灵根?.type === '转生' || (B_player.level_id ?? 0) > 41)) {
            Send(Text(`${B_player.名号}使用了道具替身人偶,躲过了此次打劫`));
            await addNajieThing(B, '替身人偶', '道具', -1);
            return false;
        }
        const mdzJL = B_player.魔道值 || 0;
        let lingshi = Math.trunc(B_player.灵石 / 5);
        const qixue = Math.trunc(100 * now_level_idAA);
        const mdz = Math.trunc(lingshi / 10000);
        if (lingshi >= B_player.灵石)
            lingshi = Math.trunc(B_player.灵石 / 2);
        A_player.灵石 += lingshi + mdzJL;
        B_player.灵石 -= lingshi;
        A_player.血气 += qixue;
        A_player.魔道值 = (A_player.魔道值 || 0) + mdz;
        await writePlayer(A, A_player);
        await writePlayer(B, B_player);
        final_msg.push(`经过一番大战,${A_win},成功抢走${lingshi}灵石,${A_player.名号}获得${qixue}血气`);
    }
    else if (msgArr.includes(B_win)) {
        const qixue = Math.trunc(100 * now_level_idBB);
        if (A_player.灵石 < 30002) {
            B_player.血气 += qixue;
            await writePlayer(B, B_player);
            const action_time2 = 60000 * 60;
            try {
                const actRaw = await redis.get(`xiuxian@1.3.0:${A}:action`);
                const act = actRaw ? JSON.parse(actRaw) : { action: '禁闭' };
                act.action = '禁闭';
                act.end_time = Date.now() + action_time2;
                await redis.set(`xiuxian@1.3.0:${A}:action`, JSON.stringify(act));
            }
            catch {
            }
            final_msg.push(`经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号}被关禁闭60分钟`);
        }
        else {
            let lingshi = Math.trunc(A_player.灵石 / 4);
            if (lingshi < 0)
                lingshi = 0;
            A_player.灵石 -= lingshi;
            B_player.灵石 += lingshi;
            B_player.血气 += qixue;
            await writePlayer(A, A_player);
            await writePlayer(B, B_player);
            final_msg.push(`经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号}被劫走${lingshi}灵石`);
        }
    }
    else {
        Send(Text('战斗过程出错'));
        return false;
    }
    Send(Text(final_msg.join('\n')));
    return false;
});

export { res as default, regular };
