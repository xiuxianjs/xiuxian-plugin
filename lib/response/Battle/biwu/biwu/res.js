import { getRedisKey } from '../../../../model/keys.js';
import { useSend, useMention, Text, Image } from 'alemonjs';
import * as _ from 'lodash-es';
import { baojishanghai, Harm, ifbaoji } from '../../../../model/battle.js';
import { sleep } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { pushInfo, redis } from '../../../../model/api.js';
import { selects } from '../../../index.js';
import { biwuPlayer } from '../biwu.js';
import { screenshot } from '../../../../image/index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?切磋$/;
function getSkill(name) {
    return data.jineng.find((s) => s.name === name);
}
function clonePlayer(p) {
    return _.cloneDeep(p);
}
function buildSelectMsg(list) {
    const lines = ['指令样式:#选择技能1,2,3\n请选择你本局携带的技能:'];
    list.forEach((n, idx) => {
        const cfg = getSkill(n);
        lines.push(`\n${idx + 1}、${n} cd:${cfg ? cfg.cd : 0}`);
    });
    return lines;
}
function buildRoundMsg(skills, cnt) {
    const lines = [
        `指令样式:#释放技能1\n第${cnt}回合,是否释放以下技能:`
    ];
    skills.forEach((s, idx) => {
        s.cd++;
        const cfg = getSkill(s.name);
        const left = cfg ? Math.max(cfg.cd - s.cd, 0) : 0;
        lines.push(`\n${idx + 1}、${s.name} cd:${left}`);
    });
    return lines;
}
function applyBuffDecay(source, _targetUnused, buffName, effect, msgArr, label) {
    if (source[buffName]) {
        effect();
        source[buffName]--;
        msgArr.push(label.replace('{left}', String(source[buffName])));
    }
}
const BASE_SKILLS = [
    '四象封印',
    '桃园结义',
    '长生诀',
    '祝水咒',
    '阴风蚀骨',
    '万年俱灰',
    '心烦意乱',
    '失魂落魄',
    '玄冰封印',
    '诛仙三剑'
];
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    const A_QQ = biwuPlayer.A_QQ;
    const B_QQ = biwuPlayer.B_QQ;
    const A = e.UserId;
    if (!(await existplayer(A)))
        return false;
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0)
        return false;
    const User = Mentions.find(item => !item.IsBot);
    if (!User)
        return false;
    const B = User.UserId;
    if (A === B)
        return false;
    if (!(await existplayer(B))) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    if (B_QQ.some(i => i.QQ === A || i.QQ === B) ||
        A_QQ.some(i => i.QQ === A || i.QQ === B)) {
        Send(Text('你或他已经在战斗中了'));
        return false;
    }
    A_QQ.push({ QQ: A, 技能: [...BASE_SKILLS], 选择技能: [] });
    B_QQ.push({ QQ: B, 技能: [...BASE_SKILLS], 选择技能: [] });
    await battle(e, A_QQ.length - 1);
    return false;
});
async function battle(e, num) {
    const evt = e;
    const A_QQ = biwuPlayer.A_QQ;
    const B_QQ = biwuPlayer.B_QQ;
    const Send = useSend(evt);
    const A_player = await readPlayer(A_QQ[num].QQ);
    const B_player = await readPlayer(B_QQ[num].QQ);
    A_player.攻击 = B_player.攻击;
    A_player.防御 = B_player.防御;
    A_player.当前血量 = B_player.当前血量;
    A_player.血量上限 = B_player.血量上限;
    A_player.暴击率 = B_player.暴击率;
    const A_init = clonePlayer(A_player);
    const B_init = clonePlayer(B_player);
    const msg_A = buildSelectMsg(A_QQ[num].技能);
    const msg_B = buildSelectMsg(B_QQ[num].技能);
    pushInfo(A_QQ[num].QQ, false, msg_A);
    pushInfo(B_QQ[num].QQ, false, msg_B);
    await sleep(40000);
    let cnt = 1;
    let action_A = { cnt, 技能: A_QQ[num].选择技能, use: -1 };
    let action_B = { cnt, 技能: B_QQ[num].选择技能, use: -1 };
    await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(action_A));
    await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(action_B));
    const buff_A = {};
    const buff_B = {};
    const history = [];
    while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
        const roundMsgs = [];
        const round_A = buildRoundMsg(action_A.技能, cnt);
        await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(action_A));
        pushInfo(A_QQ[num].QQ, false, round_A);
        const round_B = buildRoundMsg(action_B.技能, cnt);
        await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(action_B));
        pushInfo(B_QQ[num].QQ, false, round_B);
        await sleep(20000);
        action_A = JSON.parse((await redis.get(getRedisKey(A_QQ[num].QQ, 'bisai'))) || '{}');
        action_B = JSON.parse((await redis.get(getRedisKey(B_QQ[num].QQ, 'bisai'))) || '{}');
        if (action_A.技能 && action_A.技能[action_A.use])
            action_A.技能[action_A.use].cd = 0;
        applyBuffDecay(buff_B, A_player, '四象封印', () => {
            action_A.use = -1;
        }, roundMsgs, `${A_player.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buff_B, A_player, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr)
                A_player.攻击 *= 1 - cfg.pr;
        }, roundMsgs, `${A_player.名号}受到侵蚀,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, A_player, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr)
                A_player.攻击 *= 1 - cfg.pr;
        }, roundMsgs, `${A_player.名号}受到立场影响,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, A_player, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr)
                A_player.暴击率 = cfg.pr;
        }, roundMsgs, `${A_player.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buff_A, B_player, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr)
                B_player.防御 *= 1 - cfg.pr;
        }, roundMsgs, `${B_player.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buff_A, B_player, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr)
                B_player.防御 *= 1 - cfg.pr;
        }, roundMsgs, `${B_player.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buff_A, A_player, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr)
                A_player.当前血量 += Math.trunc(A_player.血量上限 * cfg.pr);
        }, roundMsgs, `${A_player.名号}血量回复,剩余回合{left}`);
        const A_baoji = baojishanghai(A_player.暴击率);
        let A_harm = Harm(A_player.攻击, B_player.防御);
        const A_faqiu = Math.trunc(A_player.攻击 * Number(A_player.灵根?.法球倍率 || 0));
        A_harm = Math.trunc(A_baoji * A_harm + A_faqiu + A_player.防御 * 0.1);
        if (action_A.use !== -1 && action_A.技能 && action_A.技能[action_A.use]) {
            const sk = action_A.技能[action_A.use];
            switch (sk.name) {
                case '四象封印':
                    buff_A.四象封印 = sk.last || 0;
                    break;
                case '桃园结义':
                    if (sk.pr) {
                        B_player.当前血量 += Math.trunc(B_player.当前血量 * sk.pr);
                        A_player.当前血量 += Math.trunc(A_player.当前血量 * sk.pr);
                    }
                    break;
                case '长生诀':
                    if (sk.pr)
                        A_player.当前血量 += Math.trunc(A_player.血量上限 * sk.pr);
                    break;
                case '祝水咒':
                    buff_A.祝水咒 = sk.last || 0;
                    break;
                case '阴风蚀骨':
                    buff_A.阴风蚀骨 = sk.last || 0;
                    break;
                case '万年俱灰':
                    buff_A.万年俱灰 = sk.last || 0;
                    break;
                case '心烦意乱':
                    buff_A.心烦意乱 = sk.last || 0;
                    break;
                case '失魂落魄':
                    buff_A.失魂落魄 = sk.last || 0;
                    break;
                case '玄冰封印':
                    buff_A.玄冰封印 = sk.last || 0;
                    break;
                case '诛仙三剑':
                    buff_A.诛仙三剑 = sk.last || 0;
                    break;
            }
            if (sk.msg)
                roundMsgs.push(`${A_player.名号}${sk.msg}`);
        }
        if (buff_A.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr)
                A_harm = Math.trunc(A_harm * (1 + cfg.pr));
            buff_A.诛仙三剑--;
        }
        B_player.当前血量 -= A_harm;
        roundMsgs.push(`第${cnt}回合,${A_player.名号}普通攻击，${ifbaoji(A_baoji)}造成伤害${A_harm}，${B_player.名号}剩余血量${B_player.当前血量}`);
        if (B_player.当前血量 <= 0) {
            history.push(roundMsgs);
            break;
        }
        if (action_B.技能 && action_B.技能[action_B.use])
            action_B.技能[action_B.use].cd = 0;
        applyBuffDecay(buff_A, B_player, '四象封印', () => {
            action_B.use = -1;
        }, roundMsgs, `${B_player.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buff_A, B_player, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr)
                B_player.攻击 *= 1 - cfg.pr;
        }, roundMsgs, `${B_player.名号}攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_A, B_player, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr)
                B_player.攻击 *= 1 - cfg.pr;
        }, roundMsgs, `${B_player.名号}攻击力下降,剩余回合{left}`);
        applyBuffDecay(buff_A, B_player, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr)
                B_player.暴击率 = cfg.pr;
        }, roundMsgs, `${B_player.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buff_B, A_player, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr)
                A_player.防御 *= 1 - cfg.pr;
        }, roundMsgs, `${A_player.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, A_player, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr)
                A_player.防御 *= 1 - cfg.pr;
        }, roundMsgs, `${A_player.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buff_B, B_player, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr)
                B_player.当前血量 += Math.trunc(B_player.血量上限 * cfg.pr);
        }, roundMsgs, `${B_player.名号}血量回复,剩余回合{left}`);
        const B_baoji = baojishanghai(B_player.暴击率);
        let B_harm = Harm(B_player.攻击, A_player.防御);
        const B_faqiu = Math.trunc(B_player.攻击 * Number(B_player.灵根?.法球倍率 || 0));
        B_harm = Math.trunc(B_baoji * B_harm + B_faqiu + B_player.防御 * 0.1);
        if (action_B.use !== -1 && action_B.技能 && action_B.技能[action_B.use]) {
            const sk = action_B.技能[action_B.use];
            switch (sk.name) {
                case '四象封印':
                    buff_B.四象封印 = sk.last || 0;
                    break;
                case '桃园结义':
                    if (sk.pr) {
                        B_player.当前血量 += Math.trunc(B_player.当前血量 * sk.pr);
                        A_player.当前血量 += Math.trunc(A_player.当前血量 * (1 + sk.pr));
                    }
                    break;
                case '长生诀':
                    if (sk.pr)
                        B_player.当前血量 += Math.trunc(B_player.血量上限 * sk.pr);
                    break;
                case '祝水咒':
                    buff_B.祝水咒 = sk.last || 0;
                    break;
                case '阴风蚀骨':
                    buff_B.阴风蚀骨 = sk.last || 0;
                    break;
                case '万年俱灰':
                    buff_B.万年俱灰 = sk.last || 0;
                    break;
                case '心烦意乱':
                    buff_B.心烦意乱 = sk.last || 0;
                    break;
                case '失魂落魄':
                    buff_B.失魂落魄 = sk.last || 0;
                    break;
                case '玄冰封印':
                    buff_B.玄冰封印 = sk.last || 0;
                    break;
                case '诛仙三剑':
                    buff_B.诛仙三剑 = sk.last || 0;
                    break;
            }
            if (sk.msg)
                roundMsgs.push(`${B_player.名号}${sk.msg}`);
        }
        if (buff_B.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr)
                B_harm = Math.trunc(B_harm * (1 + cfg.pr));
            buff_B.诛仙三剑--;
        }
        A_player.当前血量 -= B_harm;
        roundMsgs.push(`第${cnt}回合,${B_player.名号}普通攻击，${ifbaoji(B_baoji)}造成伤害${B_harm}，${A_player.名号}剩余血量${A_player.当前血量}`);
        cnt++;
        pushInfo(A_QQ[num].QQ, false, roundMsgs);
        pushInfo(B_QQ[num].QQ, false, roundMsgs);
        history.push(roundMsgs);
        action_A.use = -1;
        action_B.use = -1;
        await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(action_A));
        await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(action_B));
        A_player.攻击 = A_init.攻击;
        A_player.防御 = A_init.防御;
        A_player.暴击率 = A_init.暴击率;
        B_player.攻击 = B_init.攻击;
        B_player.防御 = B_init.防御;
        B_player.暴击率 = B_init.暴击率;
    }
    const img = await screenshot('CombatResult', ``, {
        msg: history.flat(),
        playerA: {
            id: A_QQ[num].QQ,
            name: A_player.名号,
            power: A_player.攻击,
            hp: A_player.当前血量,
            maxHp: A_player.血量上限
        },
        playerB: {
            id: B_QQ[num].QQ,
            name: B_player.名号,
            power: B_player.攻击,
            hp: B_player.当前血量,
            maxHp: B_player.血量上限
        },
        result: A_player.当前血量 <= 0 ? 'B' : B_player.当前血量 <= 0 ? 'A' : 'draw'
    });
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
    else {
        Send(Text(A_player.当前血量 <= 0 ? `${B_player.名号}win!` : `${A_player.名号}win!`));
    }
    const aQQ = A_QQ[num].QQ;
    const bQQ = B_QQ[num].QQ;
    A_QQ[num].QQ = null;
    B_QQ[num].QQ = null;
    await redis.set(getRedisKey(aQQ, 'bisai'), '');
    await redis.set(getRedisKey(bQQ, 'bisai'), '');
    return false;
}

export { res as default, regular };
