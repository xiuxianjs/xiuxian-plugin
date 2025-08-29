import { getRedisKey } from '../../../../model/keys.js';
import { useSend, useMention, Text, Image } from 'alemonjs';
import * as _ from 'lodash-es';
import { baojishanghai, Harm, ifbaoji } from '../../../../model/battle.js';
import { sleep } from '../../../../model/common.js';
import { pushInfo, redis } from '../../../../model/api.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/currency.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';
import { biwuPlayer } from '../biwu.js';

const regular = /^(#|＃|\/)?切磋$/;
function clonePlayer(p) {
    return _.cloneDeep(p);
}
function applyBuffDecay(source, _targetUnused, buffName, effect, msgArr, label) {
    if (source[buffName]) {
        effect();
        source[buffName]--;
        msgArr.push(label.replace('{left}', String(source[buffName])));
    }
}
const BASE_SKILLS = ['四象封印', '桃园结义', '长生诀', '祝水咒', '阴风蚀骨', '万年俱灰', '心烦意乱', '失魂落魄', '玄冰封印', '诛仙三剑'];
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    const A_QQ = biwuPlayer.A_QQ;
    const B_QQ = biwuPlayer.B_QQ;
    const A = e.UserId;
    if (!(await existplayer(A))) {
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
        return false;
    }
    if (!(await existplayer(B))) {
        void Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    if (B_QQ.some(i => i.QQ === A || i.QQ === B) || A_QQ.some(i => i.QQ === A || i.QQ === B)) {
        void Send(Text('你或他已经在战斗中了'));
        return false;
    }
    A_QQ.push({ QQ: A, 技能: [...BASE_SKILLS], 选择技能: [] });
    B_QQ.push({ QQ: B, 技能: [...BASE_SKILLS], 选择技能: [] });
    await battle(e, A_QQ.length - 1);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);
async function battle(e, num) {
    const JinengData = await getDataList('Jineng');
    function getSkill(name) {
        const data = JinengData;
        return data.find(s => s.name === name);
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
        const lines = [`指令样式:#释放技能1\n第${cnt}回合,是否释放以下技能:`];
        skills.forEach((s, idx) => {
            s.cd++;
            const cfg = getSkill(s.name);
            const left = cfg ? Math.max(cfg.cd - s.cd, 0) : 0;
            lines.push(`\n${idx + 1}、${s.name} cd:${left}`);
        });
        return lines;
    }
    const evt = e;
    const A_QQ = biwuPlayer.A_QQ;
    const B_QQ = biwuPlayer.B_QQ;
    const Send = useSend(evt);
    const playerA = await readPlayer(A_QQ[num].QQ);
    const playerB = await readPlayer(B_QQ[num].QQ);
    playerA.攻击 = playerB.攻击;
    playerA.防御 = playerB.防御;
    playerA.当前血量 = playerB.当前血量;
    playerA.血量上限 = playerB.血量上限;
    playerA.暴击率 = playerB.暴击率;
    const A_init = clonePlayer(playerA);
    const B_init = clonePlayer(playerB);
    const msg_A = buildSelectMsg(A_QQ[num].技能);
    const msg_B = buildSelectMsg(B_QQ[num].技能);
    pushInfo(A_QQ[num].QQ, false, msg_A);
    pushInfo(B_QQ[num].QQ, false, msg_B);
    await sleep(40000);
    let cnt = 1;
    let actionA = { cnt, 技能: A_QQ[num].选择技能, use: -1 };
    let actionB = { cnt, 技能: B_QQ[num].选择技能, use: -1 };
    await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(actionA));
    await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(actionB));
    const buff_A = {};
    const buff_B = {};
    const history = [];
    while (playerA.当前血量 > 0 && playerB.当前血量 > 0) {
        const roundMsgs = [];
        const round_A = buildRoundMsg(actionA.技能, cnt);
        await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(actionA));
        pushInfo(A_QQ[num].QQ, false, round_A);
        const round_B = buildRoundMsg(actionB.技能, cnt);
        await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(actionB));
        pushInfo(B_QQ[num].QQ, false, round_B);
        await sleep(20000);
        actionA = JSON.parse((await redis.get(getRedisKey(A_QQ[num].QQ, 'bisai'))) || '{}');
        actionB = JSON.parse((await redis.get(getRedisKey(B_QQ[num].QQ, 'bisai'))) || '{}');
        if (actionA.技能?.[actionA.use]) {
            actionA.技能[actionA.use].cd = 0;
        }
        applyBuffDecay(buff_B, playerA, '四象封印', () => {
            actionA.use = -1;
        }, roundMsgs, `${playerA.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buff_B, playerA, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr) {
                playerA.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}受到侵蚀,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, playerA, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr) {
                playerA.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}受到立场影响,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, playerA, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr) {
                playerA.暴击率 = cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buff_A, playerB, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr) {
                playerB.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buff_A, playerB, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr) {
                playerB.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buff_A, playerA, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr) {
                playerA.当前血量 += Math.trunc(playerA.血量上限 * cfg.pr);
            }
        }, roundMsgs, `${playerA.名号}血量回复,剩余回合{left}`);
        const A_baoji = baojishanghai(playerA.暴击率);
        let A_harm = Harm(playerA.攻击, playerB.防御);
        const A_faqiu = Math.trunc(playerA.攻击 * Number(playerA.灵根?.法球倍率 || 0));
        A_harm = Math.trunc(A_baoji * A_harm + A_faqiu + playerA.防御 * 0.1);
        if (actionA.use !== -1 && actionA.技能?.[actionA.use]) {
            const sk = actionA.技能[actionA.use];
            switch (sk.name) {
                case '四象封印':
                    buff_A.四象封印 = sk.last || 0;
                    break;
                case '桃园结义':
                    if (sk.pr) {
                        playerB.当前血量 += Math.trunc(playerB.当前血量 * sk.pr);
                        playerA.当前血量 += Math.trunc(playerA.当前血量 * sk.pr);
                    }
                    break;
                case '长生诀':
                    if (sk.pr) {
                        playerA.当前血量 += Math.trunc(playerA.血量上限 * sk.pr);
                    }
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
            if (sk.msg) {
                roundMsgs.push(`${playerA.名号}${sk.msg}`);
            }
        }
        if (buff_A.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr) {
                A_harm = Math.trunc(A_harm * (1 + cfg.pr));
            }
            buff_A.诛仙三剑--;
        }
        playerB.当前血量 -= A_harm;
        roundMsgs.push(`第${cnt}回合,${playerA.名号}普通攻击，${ifbaoji(A_baoji)}造成伤害${A_harm}，${playerB.名号}剩余血量${playerB.当前血量}`);
        if (playerB.当前血量 <= 0) {
            history.push(roundMsgs);
            break;
        }
        if (actionB.技能?.[actionB.use]) {
            actionB.技能[actionB.use].cd = 0;
        }
        applyBuffDecay(buff_A, playerB, '四象封印', () => {
            actionB.use = -1;
        }, roundMsgs, `${playerB.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buff_A, playerB, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr) {
                playerB.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}攻击力降低,剩余回合{left}`);
        applyBuffDecay(buff_A, playerB, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr) {
                playerB.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}攻击力下降,剩余回合{left}`);
        applyBuffDecay(buff_A, playerB, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr) {
                playerB.暴击率 = cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buff_B, playerA, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr) {
                playerA.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buff_B, playerA, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr) {
                playerA.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buff_B, playerB, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr) {
                playerB.当前血量 += Math.trunc(playerB.血量上限 * cfg.pr);
            }
        }, roundMsgs, `${playerB.名号}血量回复,剩余回合{left}`);
        const B_baoji = baojishanghai(playerB.暴击率);
        let B_harm = Harm(playerB.攻击, playerA.防御);
        const B_faqiu = Math.trunc(playerB.攻击 * Number(playerB.灵根?.法球倍率 || 0));
        B_harm = Math.trunc(B_baoji * B_harm + B_faqiu + playerB.防御 * 0.1);
        if (actionB.use !== -1 && actionB.技能?.[actionB.use]) {
            const sk = actionB.技能[actionB.use];
            switch (sk.name) {
                case '四象封印':
                    buff_B.四象封印 = sk.last || 0;
                    break;
                case '桃园结义':
                    if (sk.pr) {
                        playerB.当前血量 += Math.trunc(playerB.当前血量 * sk.pr);
                        playerA.当前血量 += Math.trunc(playerA.当前血量 * (1 + sk.pr));
                    }
                    break;
                case '长生诀':
                    if (sk.pr) {
                        playerB.当前血量 += Math.trunc(playerB.血量上限 * sk.pr);
                    }
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
            if (sk.msg) {
                roundMsgs.push(`${playerB.名号}${sk.msg}`);
            }
        }
        if (buff_B.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr) {
                B_harm = Math.trunc(B_harm * (1 + cfg.pr));
            }
            buff_B.诛仙三剑--;
        }
        playerA.当前血量 -= B_harm;
        roundMsgs.push(`第${cnt}回合,${playerB.名号}普通攻击，${ifbaoji(B_baoji)}造成伤害${B_harm}，${playerA.名号}剩余血量${playerA.当前血量}`);
        cnt++;
        pushInfo(A_QQ[num].QQ, false, roundMsgs);
        pushInfo(B_QQ[num].QQ, false, roundMsgs);
        history.push(roundMsgs);
        actionA.use = -1;
        actionB.use = -1;
        await redis.set(getRedisKey(A_QQ[num].QQ, 'bisai'), JSON.stringify(actionA));
        await redis.set(getRedisKey(B_QQ[num].QQ, 'bisai'), JSON.stringify(actionB));
        playerA.攻击 = A_init.攻击;
        playerA.防御 = A_init.防御;
        playerA.暴击率 = A_init.暴击率;
        playerB.攻击 = B_init.攻击;
        playerB.防御 = B_init.防御;
        playerB.暴击率 = B_init.暴击率;
    }
    const img = await screenshot('CombatResult', A_QQ[num].QQ, {
        msg: history.flat(),
        playerA: {
            id: A_QQ[num].QQ,
            name: playerA.名号,
            power: playerA.攻击,
            hp: playerA.当前血量,
            maxHp: playerA.血量上限
        },
        playerB: {
            id: B_QQ[num].QQ,
            name: playerB.名号,
            power: playerB.攻击,
            hp: playerB.当前血量,
            maxHp: playerB.血量上限
        },
        result: playerA.当前血量 <= 0 ? 'B' : playerB.当前血量 <= 0 ? 'A' : 'draw'
    });
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
    else {
        void Send(Text(playerA.当前血量 <= 0 ? `${playerB.名号}win!` : `${playerA.名号}win!`));
    }
    const aQQ = A_QQ[num].QQ;
    const bQQ = B_QQ[num].QQ;
    A_QQ[num].QQ = null;
    B_QQ[num].QQ = null;
    await redis.set(getRedisKey(aQQ, 'bisai'), '');
    await redis.set(getRedisKey(bQQ, 'bisai'), '');
    return false;
}

export { res$1 as default, regular };
