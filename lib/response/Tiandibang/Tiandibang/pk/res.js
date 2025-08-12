import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
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
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { shijianc } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
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
import { readTiandibang, Write_tiandibang, getLastbisai } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?比试$/;
const toNum = (v, d = 0) => typeof v === 'number' && !isNaN(v)
    ? v
    : typeof v === 'string' && !isNaN(+v)
        ? +v
        : d;
const RD_KEY = (qq, k) => `xiuxian@1.3.0:${qq}:${k}`;
const randomScale = () => 0.8 + 0.4 * Math.random();
function buildBattlePlayer(src, atkMul = 1, defMul = 1, hpMul = 1) {
    const lgRaw = src.灵根;
    const linggenObj = (lgRaw && typeof lgRaw === 'object' ? lgRaw : {});
    const linggen = linggenObj;
    return {
        名号: src.名号,
        攻击: Math.floor(toNum(src.攻击) * atkMul),
        防御: Math.floor(toNum(src.防御) * defMul),
        当前血量: Math.floor(toNum(src.当前血量) * hpMul),
        暴击率: toNum(src.暴击率),
        学习的功法: Array.isArray(src.学习的功法)
            ? src.学习的功法
            : [],
        灵根: linggen,
        法球倍率: typeof src.法球倍率 === 'number' ? src.法球倍率 : toNum(src.法球倍率)
    };
}
function settleWin(self, isWild, lastMsg, opponentName, win) {
    if (win) {
        self.积分 += isWild ? 1500 : 2000;
    }
    else {
        self.积分 += isWild ? 800 : 1000;
    }
    self.次数 -= 1;
    const lingshi = self.积分 * (isWild ? (win ? 8 : 6) : win ? 4 : 2);
    lastMsg.push(win
        ? `${self.名号}击败了[${opponentName}],当前积分[${self.积分}],获得了[${lingshi}]灵石`
        : `${self.名号}被[${opponentName}]打败了,当前积分[${self.积分}],获得了[${lingshi}]灵石`);
    return lingshi;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const usr_qq_num = parseInt(usr_qq, 10);
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const game_action = await redis.get(RD_KEY(usr_qq, 'game_action'));
    if (+game_action == 1) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let action = null;
    const actionStr = await redis.get(RD_KEY(usr_qq, 'action'));
    if (actionStr) {
        try {
            action = JSON.parse(actionStr);
        }
        catch { }
    }
    if (action) {
        const action_end_time = action.end_time;
        const now_time = Date.now();
        if (now_time <= action_end_time) {
            const m = Math.floor((action_end_time - now_time) / 1000 / 60);
            const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    let x = tiandibang.length;
    for (let m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq === usr_qq_num) {
            x = m;
            break;
        }
    }
    if (x == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    const last_msg = [];
    let atk = 1;
    let def = 1;
    let blood = 1;
    const now = new Date();
    const nowTime = now.getTime();
    const Today = await shijianc(nowTime);
    const lastbisai_time = await getLastbisai(usr_qq);
    if (lastbisai_time &&
        (Today.Y != lastbisai_time.Y ||
            Today.M != lastbisai_time.M ||
            Today.D != lastbisai_time.D)) {
        await redis.set(RD_KEY(usr_qq, 'lastbisai_time'), nowTime);
        tiandibang[x].次数 = 3;
    }
    if (lastbisai_time &&
        Today.Y == lastbisai_time.Y &&
        Today.M == lastbisai_time.M &&
        Today.D == lastbisai_time.D &&
        tiandibang[x].次数 < 1) {
        const zbl = await existNajieThing(usr_qq, '摘榜令', '道具');
        if (typeof zbl === 'number' && zbl > 0) {
            tiandibang[x].次数 = 1;
            await addNajieThing(usr_qq, '摘榜令', '道具', -1);
            last_msg.push(`${tiandibang[x].名号}使用了摘榜令\n`);
        }
        else {
            Send(Text('今日挑战次数用光了,请明日再来吧'));
            return false;
        }
    }
    await Write_tiandibang(tiandibang);
    let lingshi = 0;
    tiandibang = await readTiandibang();
    if (x != 0) {
        let k;
        for (k = x - 1; k >= 0; k--) {
            if (tiandibang[x].境界 > 41)
                break;
            else {
                if (tiandibang[k].境界 > 41) {
                    continue;
                }
                else
                    break;
            }
        }
        let B_player;
        if (k != -1) {
            if (tiandibang[k].攻击 / tiandibang[x].攻击 > 2) {
                atk = 2;
                def = 2;
                blood = 2;
            }
            else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.6) {
                atk = 1.6;
                def = 1.6;
                blood = 1.6;
            }
            else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.3) {
                atk = 1.3;
                def = 1.3;
                blood = 1.3;
            }
            B_player = buildBattlePlayer(tiandibang[k]);
        }
        const A_player = buildBattlePlayer(tiandibang[x], atk, def, blood);
        if (k == -1) {
            atk = randomScale();
            def = randomScale();
            blood = randomScale();
            B_player = buildBattlePlayer(tiandibang[x], atk, def, blood);
            B_player.名号 = '灵修兽';
        }
        const Data_battle = await zdBattle(A_player, B_player);
        const msg = Data_battle.msg || [];
        const A_win = `${A_player.名号}击败了${B_player.名号}`;
        const B_win = `${B_player.名号}击败了${A_player.名号}`;
        if (msg.includes(A_win)) {
            lingshi = settleWin(tiandibang[x], k == -1, last_msg, B_player.名号, true);
            await Write_tiandibang(tiandibang);
        }
        else if (msg.includes(B_win)) {
            lingshi = settleWin(tiandibang[x], k == -1, last_msg, B_player.名号, false);
            await Write_tiandibang(tiandibang);
        }
        else {
            Send(Text(`战斗过程出错`));
            return false;
        }
        await addCoin(usr_qq, lingshi);
        if (msg.length > 50) {
            logger.info('通过');
        }
        else {
            Send(Text(msg.join('\n')));
        }
        Send(Text(last_msg.join('\n')));
    }
    else {
        const A_player = buildBattlePlayer(tiandibang[x]);
        atk = randomScale();
        def = randomScale();
        blood = randomScale();
        const B_player = buildBattlePlayer(tiandibang[x], atk, def, blood);
        B_player.名号 = '灵修兽';
        const Data_battle = await zdBattle(A_player, B_player);
        const msg = Data_battle.msg || [];
        const A_win = `${A_player.名号}击败了${B_player.名号}`;
        const B_win = `${B_player.名号}击败了${A_player.名号}`;
        if (msg.includes(A_win)) {
            lingshi = settleWin(tiandibang[x], true, last_msg, B_player.名号, true);
            await Write_tiandibang(tiandibang);
        }
        else if (msg.includes(B_win)) {
            lingshi = settleWin(tiandibang[x], true, last_msg, B_player.名号, false);
            await Write_tiandibang(tiandibang);
        }
        else {
            Send(Text(`战斗过程出错`));
            return false;
        }
        await addCoin(usr_qq, lingshi);
        if (msg.length > 50) {
            logger.info('通过');
        }
        else {
            Send(Text(msg.join('\n')));
        }
        Send(Text(last_msg.join('\n')));
    }
    tiandibang = await readTiandibang();
    tiandibang.sort((a, b) => b.积分 - a.积分);
    await Write_tiandibang(tiandibang);
});

export { res as default, regular };
