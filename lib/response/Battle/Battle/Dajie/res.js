import { getRedisKey, keys } from '../../../../model/keys.js';
import { useSend, Text, useMention, Image } from 'alemonjs';
import { getAvatar } from '../../../../model/utils/utilsx.js';
import { redis } from '../../../../model/api.js';
import config from '../../../../model/Config.js';
import { writePlayer } from '../../../../model/pub.js';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addHP } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { zdBattle } from '../../../../model/battle.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';
import { getDataByUserId } from '../../../../model/Redis.js';

const regular = /^(#|＃|\/)?打劫$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function extractFaQiu(lg) {
    if (!lg || typeof lg !== 'object') {
        return undefined;
    }
    const v = lg.法球倍率;
    return typeof v === 'number' ? v : undefined;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const nowDate = new Date();
    const { openHour, closeHour } = (await config.getConfig('xiuxian', 'xiuxian'));
    const openH = typeof openHour === 'number' ? openHour : 20;
    const closeH = typeof closeHour === 'number' ? closeHour : 22;
    const day0 = new Date(nowDate);
    const dayTs = day0.setHours(0, 0, 0, 0);
    const openTime = dayTs + openH * 3600 * 1000;
    const closeTime = dayTs + closeH * 3600 * 1000;
    const nowTs = nowDate.getTime();
    if (nowTs >= openTime && nowTs <= closeTime) {
        void Send(Text('这个时间由星阁阁主看管,还是不要张扬较好'));
        return false;
    }
    const A = e.UserId;
    if (!(await existplayer(A))) {
        return false;
    }
    const last_game_timeA = await redis.get(getRedisKey(A, 'last_game_time'));
    if (last_game_timeA && Number(last_game_timeA) === 0) {
        void Send(Text('猜大小正在进行哦!'));
        return false;
    }
    const mentionsApi = useMention(e)[0];
    const Mentions = (await mentionsApi.find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return false;
    }
    const target = Mentions.find(m => !m.IsBot);
    if (!target) {
        return false;
    }
    const B = target.UserId;
    if (A === B) {
        void Send(Text('咋的，自己弄自己啊？'));
        return false;
    }
    if (!(await existplayer(B))) {
        void Send(Text('不可对凡人出手!'));
        return false;
    }
    const playerAA = await readPlayer(A);
    if (!notUndAndNull(playerAA.level_id)) {
        void Send(Text('请先#同步信息'));
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelA = levelList.find(it => it.level_id === playerAA.level_id);
    if (!levelA) {
        void Send(Text('你的境界数据异常'));
        return false;
    }
    const now_level_idAA = levelA.level_id;
    const playerBB = await readPlayer(B);
    if (!notUndAndNull(playerBB.level_id)) {
        void Send(Text('对方为错误存档！'));
        return false;
    }
    const levelB = levelList.find(it => it.level_id === playerBB.level_id);
    if (!levelB) {
        void Send(Text('对方境界数据异常'));
        return false;
    }
    const now_level_idBB = levelB.level_id;
    if (now_level_idAA > 41 && now_level_idBB <= 41) {
        void Send(Text('仙人不可对凡人出手！'));
        return false;
    }
    if (now_level_idAA >= 12 && now_level_idBB < 12) {
        void Send(Text('不可欺负弱小！'));
        return false;
    }
    const playerAFull = await getDataJSONParseByKey(keys.player(A));
    const playerBFull = await getDataJSONParseByKey(keys.player(B));
    if (!playerAFull || !playerBFull) {
        return false;
    }
    if (playerAFull?.宗门
        && playerBFull?.宗门
        && isPlayerGuildRef(playerAFull.宗门)
        && isPlayerGuildRef(playerBFull.宗门)) {
        const assA = await getDataJSONParseByKey(keys.association(playerAFull.宗门.宗门名称));
        const assB = await getDataJSONParseByKey(keys.association(playerBFull.宗门.宗门名称));
        if (!assA || !assB) {
            return false;
        }
        if (assA !== 'error'
            && assB !== 'error'
            && isExtAss(assA)
            && isExtAss(assB)
            && assA.宗门名称 === assB.宗门名称) {
            void Send(Text('门派禁止内讧'));
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
                    void Send(Text(`正在${A_action.action}中,剩余时间:${m}分${s}秒`));
                    return false;
                }
            }
        }
    }
    catch {
    }
    const last_game_timeB = await redis.get(getRedisKey(B, 'last_game_time'));
    if (last_game_timeB && Number(last_game_timeB) === 0) {
        void Send(Text('对方猜大小正在进行哦，等他赚够了再打劫也不迟!'));
        return false;
    }
    let isBbusy = false;
    let B_action = null;
    try {
        const B_action_res = await redis.get(getRedisKey(B, 'action'));
        if (B_action_res) {
            B_action = JSON.parse(B_action_res);
            if (B_action && Date.now() <= Number(B_action.end_time)) {
                isBbusy = true;
                const haveYSS = await existNajieThing(A, '隐身水', '道具');
                if (!haveYSS) {
                    const remain = Number(B_action.end_time) - Date.now();
                    const m = Math.floor(remain / 60000);
                    const s = Math.floor((remain % 60000) / 1000);
                    void Send(Text(`对方正在${B_action.action}中,剩余时间:${m}分${s}秒`));
                    return false;
                }
            }
        }
    }
    catch {
    }
    const last_dajie_time_raw = await redis.get(getRedisKey(A, 'last_dajie_time'));
    const last_dajie_time = Number(last_dajie_time_raw) || 0;
    const cfgAuction = (await config.getConfig('xiuxian', 'xiuxian'));
    const robCdMin = cfgAuction?.CD?.rob ?? 10;
    const robTimeout = Math.floor(robCdMin * 60000);
    if (Date.now() < last_dajie_time + robTimeout) {
        const remain = last_dajie_time + robTimeout - Date.now();
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`打劫正在CD中，剩余cd:  ${m}分 ${s}秒`));
        return false;
    }
    const playerA = await readPlayer(A);
    const playerB = await readPlayer(B);
    if (playerA.修为 < 0) {
        void Send(Text('还是闭会关再打劫吧'));
        return false;
    }
    if (playerB.当前血量 < 20000) {
        void Send(Text(`${playerB.名号} 重伤未愈,就不要再打他了`));
        return false;
    }
    if (playerB.灵石 < 30002) {
        void Send(Text(`${playerB.名号} 太穷了,就不要再打他了`));
        return false;
    }
    const final_msg = [];
    if (isBbusy) {
        final_msg.push(`${playerB.名号}正在${B_action?.action}，${playerA.名号}利用隐身水悄然接近，但被发现。`);
        await addNajieThing(A, '隐身水', '道具', -1);
    }
    else {
        final_msg.push(`${playerA.名号}向${playerB.名号}发起了打劫。`);
    }
    await redis.set(getRedisKey(A, 'last_dajie_time'), String(Date.now()));
    const faA = extractFaQiu(playerA.灵根);
    if (faA !== undefined) {
        playerA.法球倍率 = faA;
    }
    const faB = extractFaQiu(playerB.灵根);
    if (faB !== undefined) {
        playerB.法球倍率 = faB;
    }
    playerA.当前血量 = playerA.血量上限;
    playerB.当前血量 = playerB.血量上限;
    let battle;
    try {
        battle = await zdBattle(playerA, playerB);
    }
    catch {
        void Send(Text('战斗过程出错'));
        return false;
    }
    const msgArr = Array.isArray(battle.msg) ? battle.msg : [];
    await addHP(A, battle.A_xue);
    await addHP(B, battle.B_xue);
    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;
    const img = await screenshot('CombatResult', A, {
        msg: final_msg,
        playerA: {
            id: A,
            name: playerA.名号,
            avatar: getAvatar(A),
            power: playerA.战力,
            hp: playerA.当前血量,
            maxHp: playerA.血量上限
        },
        playerB: {
            id: B,
            name: playerB.名号,
            avatar: getAvatar(B),
            power: playerB.战力,
            hp: playerB.当前血量,
            maxHp: playerB.血量上限
        },
        result: msgArr.includes(winA) ? 'A' : msgArr.includes(winB) ? 'B' : 'draw'
    });
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
    if (msgArr.includes(winA)) {
        const hasDoll = await existNajieThing(B, '替身人偶', '道具');
        if (hasDoll
            && playerB.魔道值 < 1
            && (playerB.灵根?.type === '转生' || (playerB.level_id ?? 0) > 41)) {
            void Send(Text(`${playerB.名号}使用了道具替身人偶,躲过了此次打劫`));
            await addNajieThing(B, '替身人偶', '道具', -1);
            return false;
        }
        const mdzJL = playerB.魔道值 || 0;
        let lingshi = Math.trunc(playerB.灵石 / 5);
        const qixue = Math.trunc(100 * now_level_idAA);
        const mdz = Math.trunc(lingshi / 10000);
        if (lingshi >= playerB.灵石) {
            lingshi = Math.trunc(playerB.灵石 / 2);
        }
        playerA.灵石 += lingshi + mdzJL;
        playerB.灵石 -= lingshi;
        playerA.血气 += qixue;
        playerA.魔道值 = (playerA.魔道值 || 0) + mdz;
        await writePlayer(A, playerA);
        await writePlayer(B, playerB);
        final_msg.push(`经过一番大战,${winA},成功抢走${lingshi}灵石,${playerA.名号}获得${qixue}血气`);
    }
    else if (msgArr.includes(winB)) {
        const qixue = Math.trunc(100 * now_level_idBB);
        if (playerA.灵石 < 30002) {
            playerB.血气 += qixue;
            await writePlayer(B, playerB);
            const action_time2 = 60000 * 60;
            try {
                const actRaw = await redis.get(getRedisKey(A, 'action'));
                const act = actRaw ? JSON.parse(actRaw) : { action: '禁闭' };
                act.action = '禁闭';
                act.end_time = Date.now() + action_time2;
                await redis.set(getRedisKey(A, 'action'), JSON.stringify(act));
            }
            catch {
            }
            final_msg.push(`经过一番大战,${playerA.名号}被${playerB.名号}击败了,${playerB.名号}获得${qixue}血气,${playerA.名号}被关禁闭60分钟`);
        }
        else {
            let lingshi = Math.trunc(playerA.灵石 / 4);
            if (lingshi < 0) {
                lingshi = 0;
            }
            playerA.灵石 -= lingshi;
            playerB.灵石 += lingshi;
            playerB.血气 += qixue;
            await writePlayer(A, playerA);
            await writePlayer(B, playerB);
            final_msg.push(`经过一番大战,${playerA.名号}被${playerB.名号}击败了,${playerB.名号}获得${qixue}血气,${playerA.名号}被劫走${lingshi}灵石`);
        }
    }
    else {
        void Send(Text('战斗过程出错'));
        return false;
    }
    void Send(Text(final_msg.join('\n')));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
