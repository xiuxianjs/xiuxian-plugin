import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { addExp4 } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?打造.*(\*[0-9]*)?$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    if (player.occupation !== '炼器师') {
        void Send(Text('铜都不炼你还炼器？'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?打造/, '').trim();
    if (!raw) {
        void Send(Text('格式: 打造装备名*数量(可选)'));
        return false;
    }
    const t = raw.split('*');
    const equipment_name = t[0].trim();
    let count = 1;
    if (t[1]) {
        const n = Number(t[1]);
        if (Number.isFinite(n) && n > 1) {
            count = Math.min(Math.trunc(n), 20);
        }
    }
    const data = await getDataList('Tuzhi');
    const tuzhiCandidate = data.find(it => {
        return !!it && typeof it === 'object' && it.name === equipment_name;
    });
    const tuzhi = tuzhiCandidate;
    if (!tuzhi || typeof tuzhi.rate !== 'number' || !Array.isArray(tuzhi.exp) || !Array.isArray(tuzhi.materials)) {
        void Send(Text(`世界上没有[${equipment_name}]的图纸或配置不完整`));
        return false;
    }
    if (!Array.isArray(tuzhi.materials)) {
        void Send(Text('图纸材料配置异常'));
        return false;
    }
    if (!Array.isArray(tuzhi.exp) || tuzhi.exp.length === 0) {
        void Send(Text('图纸经验配置缺失'));
        return false;
    }
    let suc_rate = Number(tuzhi.rate) || 0;
    if (suc_rate < 0) {
        suc_rate = 0;
    }
    if (suc_rate > 1) {
        suc_rate = 1;
    }
    let occRate = 0;
    if (player.occupation_level > 0) {
        const dataList = await getDataList('experience');
        const occConf = dataList.find(item => item.id === player.occupation_level);
        if (occConf) {
            const base = Number(occConf.experience) || 0;
            occRate = Math.min(base / 10000, 1) * 0.25;
        }
    }
    let extraMsg = '';
    if (player.occupation === '炼器师') {
        extraMsg += `你是炼器师，额外增加成功率${Math.floor(occRate * 100)}%(乘算)，`;
        suc_rate *= 1 + occRate;
        if (player.occupation_level >= 24) {
            suc_rate = 0.8;
        }
    }
    if (suc_rate > 0.95) {
        suc_rate = 0.95;
    }
    const expGainPer = tuzhi.exp[0];
    for (const m of tuzhi.materials) {
        const owned = await existNajieThing(userId, m.name, '材料');
        const need = m.amount * count;
        if (typeof owned !== 'number' || owned < need) {
            void Send(Text(`纳戒中拥有${m.name}×${owned || 0}，打造需要${need}份`));
            return false;
        }
    }
    let costMsg = '消耗';
    for (const m of tuzhi.materials) {
        const need = m.amount * count;
        costMsg += `${m.name}×${need}，`;
        await addNajieThing(userId, m.name, '材料', -need);
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
            await addNajieThing(userId, equipment_name, '装备', 1, pinji);
        }
    }
    if (success === 0) {
        const random = Math.random();
        if (random < 0.5) {
            void Send(Text(`${costMsg}打造装备时不小心锤断了刃芯，打造失败！`));
        }
        else {
            void Send(Text(`${costMsg}打造装备时没有把控好火候，烧毁了，打造失败！`));
        }
        return false;
    }
    const totalExp = expGainPer * success;
    await addExp4(userId, totalExp);
    let pjSummary = Object.entries(pinjiStat)
        .sort((a, b) => pinjiName.indexOf(b[0]) - pinjiName.indexOf(a[0]))
        .map(([k, v]) => `${k}×${v}`)
        .join('，');
    if (!pjSummary) {
        pjSummary = '无';
    }
    const msg = `${extraMsg}${costMsg}打造成功${success}/${count}件，获得${equipment_name}(${pjSummary})，炼器经验+${totalExp}`;
    void Send(Text(msg));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
