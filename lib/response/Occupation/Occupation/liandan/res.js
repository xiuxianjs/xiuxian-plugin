import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import { existplayer, readPlayer, addExp4 } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import data from '../../../../model/XiuxianData.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?炼制.*(\*[0-9]*)?$/;
const MAX_BATCH = 999;
const SPECIAL_PILLS = new Set([
    '神心丹',
    '九阶淬体丹',
    '九阶玄元丹',
    '起死回生丹'
]);
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const player = await readPlayer(usr_qq);
    if (!player)
        return false;
    if (player.occupation !== '炼丹师') {
        Send(Text('丹是上午炼的,药是中午吃的,人是下午走的'));
        return false;
    }
    const body = e.MessageText.replace(/^(#|＃|\/)?炼制/, '').trim();
    if (!body) {
        Send(Text('格式: 炼制丹药名*数量(数量可省略)'));
        return false;
    }
    const seg = body
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    const danyao = seg[0];
    let n = toInt(await convert2integer(seg[1]), 1);
    if (n <= 0)
        n = 1;
    if (n > MAX_BATCH)
        n = MAX_BATCH;
    const danfang = data.danfang_list.find(item => item.name === danyao);
    if (!notUndAndNull(danfang)) {
        Send(Text(`世界上没有丹药[${danyao}]的配方`));
        return false;
    }
    if (danfang.level_limit > player.occupation_level) {
        Send(Text(`${danfang.level_limit}级炼丹师才能炼制${danyao}`));
        return false;
    }
    const materials = danfang.materials || [];
    if (materials.length === 0) {
        Send(Text('配方材料缺失'));
        return false;
    }
    for (const m of materials) {
        const have = (await existNajieThing(usr_qq, m.name, '草药')) || 0;
        const need = m.amount * n;
        if (have < need) {
            Send(Text(`纳戒中拥有 ${m.name} x ${have}，炼制需要 ${need} 份`));
            return false;
        }
    }
    const consumeParts = [];
    for (const m of materials) {
        const need = m.amount * n;
        consumeParts.push(`${m.name}×${need}`);
        await addNajieThing(usr_qq, m.name, '草药', -need);
    }
    const consumeMsg = '消耗' + consumeParts.join('，');
    const baseExp = Array.isArray(danfang.exp) ? toInt(danfang.exp[1], 0) : 0;
    const totalExp = baseExp * n;
    let finalQty = n;
    if (player.仙宠?.type === '炼丹') {
        const rand = Math.random();
        if (rand < (player.仙宠.加成 || 0)) {
            finalQty *= 2;
            Send(Text(`你的仙宠${player.仙宠.name}辅佐了你进行炼丹, 成功获得了双倍丹药`));
        }
        else {
            Send(Text('你的仙宠只是在旁边看着'));
        }
    }
    let resultMsg = '';
    if (SPECIAL_PILLS.has(danyao)) {
        await addNajieThing(usr_qq, danyao, '丹药', finalQty);
        resultMsg = `${consumeMsg} 得到 ${danyao} ${finalQty} 颗，获得炼丹经验 ${totalExp}`;
    }
    else {
        const lvl = player.occupation_level;
        const r1 = Math.random();
        const r2 = Math.random();
        if (r1 >= 0.1 + (lvl * 3) / 100) {
            await addNajieThing(usr_qq, '凡品' + danyao, '丹药', finalQty);
            resultMsg = `${consumeMsg} 得到 "凡品"${danyao} ${finalQty} 颗，获得炼丹经验 ${totalExp}`;
        }
        else if (r2 >= 0.4) {
            await addNajieThing(usr_qq, '极品' + danyao, '丹药', finalQty);
            resultMsg = `${consumeMsg} 得到 "极品"${danyao} ${finalQty} 颗，获得炼丹经验 ${totalExp}`;
        }
        else {
            await addNajieThing(usr_qq, '仙品' + danyao, '丹药', finalQty);
            resultMsg = `${consumeMsg} 得到 "仙品"${danyao} ${finalQty} 颗，获得炼丹经验 ${totalExp}`;
        }
    }
    await addExp4(usr_qq, totalExp);
    Send(Text(resultMsg));
    return false;
});

export { res as default, regular };
