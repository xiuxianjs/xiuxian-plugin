import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer, addExp4 } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?打造.*(\*[0-9]*)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    if (player.occupation !== '炼器师') {
        Send(Text('铜都不炼你还炼器？'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?打造/, '').trim();
    if (!raw) {
        Send(Text('格式: 打造装备名*数量(可选)'));
        return false;
    }
    const t = raw.split('*');
    const equipment_name = t[0].trim();
    let count = 1;
    if (t[1]) {
        const n = Number(t[1]);
        if (Number.isFinite(n) && n > 1)
            count = Math.min(Math.trunc(n), 20);
    }
    const tuzhiRaw = data.tuzhi_list;
    const tuzhiCandidate = tuzhiRaw.find((it) => {
        return (!!it &&
            typeof it === 'object' &&
            it.name === equipment_name);
    });
    const tuzhi = tuzhiCandidate;
    if (!tuzhi ||
        typeof tuzhi.rate !== 'number' ||
        !Array.isArray(tuzhi.exp) ||
        !Array.isArray(tuzhi.materials)) {
        Send(Text(`世界上没有[${equipment_name}]的图纸或配置不完整`));
        return false;
    }
    if (!Array.isArray(tuzhi.materials)) {
        Send(Text('图纸材料配置异常'));
        return false;
    }
    if (!Array.isArray(tuzhi.exp) || tuzhi.exp.length === 0) {
        Send(Text('图纸经验配置缺失'));
        return false;
    }
    let suc_rate = Number(tuzhi.rate) || 0;
    if (suc_rate < 0)
        suc_rate = 0;
    if (suc_rate > 1)
        suc_rate = 1;
    let occRate = 0;
    if (player.occupation_level > 0) {
        const occConf = data.occupation_exp_list.find(item => item.id == player.occupation_level);
        if (occConf) {
            const base = Number(occConf.experience) || 0;
            occRate = Math.min(base / 10000, 1) * 0.25;
        }
    }
    let extraMsg = '';
    if (player.occupation === '炼器师') {
        extraMsg += `你是炼器师，额外增加成功率${Math.floor(occRate * 100)}%(乘算)，`;
        suc_rate *= 1 + occRate;
        if (player.occupation_level >= 24)
            suc_rate = 0.8;
    }
    if (suc_rate > 0.95)
        suc_rate = 0.95;
    const expGainPer = tuzhi.exp[0];
    for (const m of tuzhi.materials) {
        const owned = await existNajieThing(usr_qq, m.name, '材料');
        const need = m.amount * count;
        if (typeof owned !== 'number' || owned < need) {
            Send(Text(`纳戒中拥有${m.name}×${owned || 0}，打造需要${need}份`));
            return false;
        }
    }
    let costMsg = '消耗';
    for (const m of tuzhi.materials) {
        const need = m.amount * count;
        costMsg += `${m.name}×${need}，`;
        await addNajieThing(usr_qq, m.name, '材料', -need);
    }
    const pinjiName = ['劣', '普', '优', '精', '极', '绝', '顶'];
    let success = 0;
    const pinjiStat = {};
    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        if (rand <= suc_rate) {
            success++;
            const pinji = Math.trunc(Math.random() * 7);
            const pjName = pinjiName[pinji];
            pinjiStat[pjName] = (pinjiStat[pjName] || 0) + 1;
            await addNajieThing(usr_qq, equipment_name, '装备', 1, pinji);
        }
    }
    if (success === 0) {
        const random = Math.random();
        if (random < 0.5) {
            Send(Text(`${costMsg}打造装备时不小心锤断了刃芯，打造失败！`));
        }
        else {
            Send(Text(`${costMsg}打造装备时没有把控好火候，烧毁了，打造失败！`));
        }
        return false;
    }
    const totalExp = expGainPer * success;
    await addExp4(usr_qq, totalExp);
    let pjSummary = Object.entries(pinjiStat)
        .sort((a, b) => pinjiName.indexOf(b[0]) - pinjiName.indexOf(a[0]))
        .map(([k, v]) => `${k}×${v}`)
        .join('，');
    if (!pjSummary)
        pjSummary = '无';
    const msg = `${extraMsg}${costMsg}打造成功${success}/${count}件，获得${equipment_name}(${pjSummary})，炼器经验+${totalExp}`;
    Send(Text(msg));
    return false;
});

export { res as default, regular };
