import { useSend, Text, useMention, Image } from 'alemonjs';
import { pushInfo } from '../../../../model/api.js';
import { keysAction } from '../../../../model/keys.js';
import { setDataJSONStringifyByKey, getDataJSONParseByKey, delDataByKey } from '../../../../model/DataControl.js';
import { getDataList } from '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import '@alemonjs/db';
import { baojishanghai, Harm, ifbaoji } from '../../../../model/battle.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'dayjs';
import 'svg-captcha';
import 'sharp';
import { sleep } from '../../../../model/common.js';
import * as _ from 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
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
    const aQq = biwuPlayer.A_QQ;
    const bQq = biwuPlayer.B_QQ;
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        void Send(Text('请@要切磋的修仙者'));
        return false;
    }
    const targetUserId = target.UserId;
    if (userId === targetUserId) {
        void Send(Text('不能和自己切磋'));
        return false;
    }
    if (!(await existplayer(targetUserId))) {
        void Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    if (bQq.some(i => i.QQ === userId || i.QQ === targetUserId) || aQq.some(i => i.QQ === userId || i.QQ === targetUserId)) {
        void Send(Text('你或他已经在战斗中了'));
        return false;
    }
    aQq.push({ QQ: userId, 技能: [...BASE_SKILLS], 选择技能: [] });
    bQq.push({ QQ: targetUserId, 技能: [...BASE_SKILLS], 选择技能: [] });
    await battle(e, aQq.length - 1);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);
async function battle(e, num) {
    const jinengData = await getDataList('Jineng');
    function getSkill(name) {
        return jinengData.find(s => s.name === name);
    }
    function buildSelectMsg(list) {
        const lines = ['指令样式:#选择技能1,2,3\n请选择你本局携带的技能:'];
        list.forEach((n, idx) => {
            const cfg = getSkill(n);
            lines.push(`\n${idx + 1}、${n} cd:${cfg?.cd ?? 0}`);
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
    const aQq = biwuPlayer.A_QQ;
    const bQq = biwuPlayer.B_QQ;
    const Send = useSend(evt);
    const playerA = await readPlayer(aQq[num].QQ);
    const playerB = await readPlayer(bQq[num].QQ);
    if (!playerA || !playerB) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    playerA.攻击 = playerB.攻击;
    playerA.防御 = playerB.防御;
    playerA.当前血量 = playerB.当前血量;
    playerA.血量上限 = playerB.血量上限;
    playerA.暴击率 = playerB.暴击率;
    const aInit = clonePlayer(playerA);
    const bInit = clonePlayer(playerB);
    const msgA = buildSelectMsg(aQq[num].技能);
    const msgB = buildSelectMsg(bQq[num].技能);
    pushInfo(aQq[num].QQ, false, msgA);
    pushInfo(bQq[num].QQ, false, msgB);
    await sleep(40000);
    let cnt = 1;
    let actionA = { cnt, 技能: aQq[num].选择技能, use: -1 };
    let actionB = { cnt, 技能: bQq[num].选择技能, use: -1 };
    await setDataJSONStringifyByKey(keysAction.bisai(aQq[num].QQ), actionA);
    await setDataJSONStringifyByKey(keysAction.bisai(bQq[num].QQ), actionB);
    const buffA = {};
    const buffB = {};
    const history = [];
    while (playerA.当前血量 > 0 && playerB.当前血量 > 0) {
        const roundMsgs = [];
        const roundA = buildRoundMsg(actionA.技能, cnt);
        await setDataJSONStringifyByKey(keysAction.bisai(aQq[num].QQ), actionA);
        pushInfo(aQq[num].QQ, false, roundA);
        const roundB = buildRoundMsg(actionB.技能, cnt);
        await setDataJSONStringifyByKey(keysAction.bisai(bQq[num].QQ), actionB);
        pushInfo(bQq[num].QQ, false, roundB);
        await sleep(20000);
        const actionARaw = (await getDataJSONParseByKey(keysAction.bisai(aQq[num].QQ)));
        const actionBRaw = (await getDataJSONParseByKey(keysAction.bisai(bQq[num].QQ)));
        actionA = actionARaw ?? { cnt, 技能: [], use: -1 };
        actionB = actionBRaw ?? { cnt, 技能: [], use: -1 };
        if (actionA.技能?.[actionA.use]) {
            actionA.技能[actionA.use].cd = 0;
        }
        applyBuffDecay(buffB, playerA, '四象封印', () => {
            actionA.use = -1;
        }, roundMsgs, `${playerA.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buffB, playerA, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr) {
                playerA.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}受到侵蚀,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buffB, playerA, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr) {
                playerA.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}受到立场影响,攻击力降低,剩余回合{left}`);
        applyBuffDecay(buffB, playerA, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr) {
                playerA.暴击率 = cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buffA, playerB, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr) {
                playerB.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buffA, playerB, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr) {
                playerB.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buffA, playerA, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr) {
                playerA.当前血量 += Math.trunc(playerA.血量上限 * cfg.pr);
            }
        }, roundMsgs, `${playerA.名号}血量回复,剩余回合{left}`);
        const aBaoji = baojishanghai(playerA.暴击率);
        let aHarm = Harm(playerA.攻击, playerB.防御);
        const aFaqiu = Math.trunc(playerA.攻击 * Number(playerA.灵根?.法球倍率 ?? 0));
        aHarm = Math.trunc(aBaoji * aHarm + aFaqiu + playerA.防御 * 0.1);
        if (actionA.use !== -1 && actionA.技能?.[actionA.use]) {
            const sk = actionA.技能[actionA.use];
            switch (sk.name) {
                case '四象封印':
                    buffA.四象封印 = sk.last ?? 0;
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
                    buffA.祝水咒 = sk.last ?? 0;
                    break;
                case '阴风蚀骨':
                    buffA.阴风蚀骨 = sk.last ?? 0;
                    break;
                case '万年俱灰':
                    buffA.万年俱灰 = sk.last ?? 0;
                    break;
                case '心烦意乱':
                    buffA.心烦意乱 = sk.last ?? 0;
                    break;
                case '失魂落魄':
                    buffA.失魂落魄 = sk.last ?? 0;
                    break;
                case '玄冰封印':
                    buffA.玄冰封印 = sk.last ?? 0;
                    break;
                case '诛仙三剑':
                    buffA.诛仙三剑 = sk.last ?? 0;
                    break;
            }
            if (sk.msg) {
                roundMsgs.push(`${playerA.名号}${sk.msg}`);
            }
        }
        if (buffA.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr) {
                aHarm = Math.trunc(aHarm * (1 + cfg.pr));
            }
            buffA.诛仙三剑--;
        }
        playerB.当前血量 -= aHarm;
        roundMsgs.push(`第${cnt}回合,${playerA.名号}普通攻击，${ifbaoji(aBaoji)}造成伤害${aHarm}，${playerB.名号}剩余血量${playerB.当前血量}`);
        if (playerB.当前血量 <= 0) {
            history.push(roundMsgs);
            break;
        }
        if (actionB.技能?.[actionB.use]) {
            actionB.技能[actionB.use].cd = 0;
        }
        applyBuffDecay(buffA, playerB, '四象封印', () => {
            actionB.use = -1;
        }, roundMsgs, `${playerB.名号}因为四象封印之力，技能失效,剩余回合{left}`);
        applyBuffDecay(buffA, playerB, '阴风蚀骨', () => {
            const cfg = getSkill('阴风蚀骨');
            if (cfg?.pr) {
                playerB.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}攻击力降低,剩余回合{left}`);
        applyBuffDecay(buffA, playerB, '万年俱灰', () => {
            const cfg = getSkill('万年俱灰');
            if (cfg?.pr) {
                playerB.攻击 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}攻击力下降,剩余回合{left}`);
        applyBuffDecay(buffA, playerB, '玄冰封印', () => {
            const cfg = getSkill('玄冰封印');
            if (cfg?.pr) {
                playerB.暴击率 = cfg.pr;
            }
        }, roundMsgs, `${playerB.名号}暴击率被压制,剩余回合{left}`);
        applyBuffDecay(buffB, playerA, '心烦意乱', () => {
            const cfg = getSkill('心烦意乱');
            if (cfg?.pr) {
                playerA.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}防御力降低,剩余回合{left}`);
        applyBuffDecay(buffB, playerA, '失魂落魄', () => {
            const cfg = getSkill('失魂落魄');
            if (cfg?.pr) {
                playerA.防御 *= 1 - cfg.pr;
            }
        }, roundMsgs, `${playerA.名号}防御力下降,剩余回合{left}`);
        applyBuffDecay(buffB, playerB, '祝水咒', () => {
            const cfg = getSkill('祝水咒');
            if (cfg?.pr) {
                playerB.当前血量 += Math.trunc(playerB.血量上限 * cfg.pr);
            }
        }, roundMsgs, `${playerB.名号}血量回复,剩余回合{left}`);
        const bBaoji = baojishanghai(playerB.暴击率);
        let bHarm = Harm(playerB.攻击, playerA.防御);
        const bFaqiu = Math.trunc(playerB.攻击 * Number(playerB.灵根?.法球倍率 ?? 0));
        bHarm = Math.trunc(bBaoji * bHarm + bFaqiu + playerB.防御 * 0.1);
        if (actionB.use !== -1 && actionB.技能?.[actionB.use]) {
            const sk = actionB.技能[actionB.use];
            switch (sk.name) {
                case '四象封印':
                    buffB.四象封印 = sk.last ?? 0;
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
                    buffB.祝水咒 = sk.last ?? 0;
                    break;
                case '阴风蚀骨':
                    buffB.阴风蚀骨 = sk.last ?? 0;
                    break;
                case '万年俱灰':
                    buffB.万年俱灰 = sk.last ?? 0;
                    break;
                case '心烦意乱':
                    buffB.心烦意乱 = sk.last ?? 0;
                    break;
                case '失魂落魄':
                    buffB.失魂落魄 = sk.last ?? 0;
                    break;
                case '玄冰封印':
                    buffB.玄冰封印 = sk.last ?? 0;
                    break;
                case '诛仙三剑':
                    buffB.诛仙三剑 = sk.last ?? 0;
                    break;
            }
            if (sk.msg) {
                roundMsgs.push(`${playerB.名号}${sk.msg}`);
            }
        }
        if (buffB.诛仙三剑) {
            const cfg = getSkill('诛仙三剑');
            if (cfg?.pr) {
                bHarm = Math.trunc(bHarm * (1 + cfg.pr));
            }
            buffB.诛仙三剑--;
        }
        playerA.当前血量 -= bHarm;
        roundMsgs.push(`第${cnt}回合,${playerB.名号}普通攻击，${ifbaoji(bBaoji)}造成伤害${bHarm}，${playerA.名号}剩余血量${playerA.当前血量}`);
        cnt++;
        pushInfo(aQq[num].QQ, false, roundMsgs);
        pushInfo(bQq[num].QQ, false, roundMsgs);
        history.push(roundMsgs);
        actionA.use = -1;
        actionB.use = -1;
        await setDataJSONStringifyByKey(keysAction.bisai(aQq[num].QQ), actionA);
        await setDataJSONStringifyByKey(keysAction.bisai(bQq[num].QQ), actionB);
        playerA.攻击 = aInit.攻击;
        playerA.防御 = aInit.防御;
        playerA.暴击率 = aInit.暴击率;
        playerB.攻击 = bInit.攻击;
        playerB.防御 = bInit.防御;
        playerB.暴击率 = bInit.暴击率;
    }
    const img = await screenshot('CombatResult', aQq[num].QQ, {
        msg: history.flat(),
        playerA: {
            id: aQq[num].QQ,
            name: playerA.名号,
            power: playerA.攻击,
            hp: playerA.当前血量,
            maxHp: playerA.血量上限
        },
        playerB: {
            id: bQq[num].QQ,
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
    void delDataByKey(keysAction.bisai(aQq[num].QQ));
    void delDataByKey(keysAction.bisai(bQq[num].QQ));
    return false;
}

export { res$1 as default, regular };
