import { pushInfo } from '../../model/api.js';
import { getDataJSONParseByKey } from '../../model/DataControl.js';
import { getDataList } from '../../model/DataList.js';
import { keys } from '../../model/keys.js';
import '@alemonjs/db';
import { Mention } from 'alemonjs';
import { addExp4 } from '../../model/xiuxian_impl.js';
import 'dayjs';
import { addNajieThing } from '../../model/najie.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../../route/core/auth.js';

function toNum(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
}
function calcEffectiveMinutes(start, end, now, slot = 15, maxSlots = 48) {
    let minutes;
    if (end > now) {
        minutes = Math.floor((now - start) / 60000);
    }
    else {
        minutes = Math.floor((end - start) / 60000);
    }
    if (minutes < slot) {
        return 0;
    }
    const full = Math.min(Math.floor(minutes / slot), maxSlots);
    return full * slot;
}
async function calcOccupationFactor(occupation_level) {
    const res = await getDataList('experience');
    return res.find(r => r.id === occupation_level)?.rate || 0;
}
async function plant_jiesuan(user_id, time, group_id) {
    const userId = user_id;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    time = Math.max(1, toNum(time));
    const exp = time * 10;
    const k = player.level_id < 22 ? 0.5 : 1;
    const occFactor = await calcOccupationFactor(player.occupation_level);
    let sum = (time / 480) * (player.occupation_level * 2 + 12) * k;
    if (player.level_id >= 36) {
        sum = (time / 480) * (player.occupation_level * 3 + 11);
    }
    const names = [
        '万年凝血草',
        '万年何首乌',
        '万年血精草',
        '万年甜甜花',
        '万年清心草',
        '古神藤',
        '万年太玄果',
        '炼骨花',
        '魔蕴花',
        '万年清灵草',
        '万年天魂菊',
        '仙蕴花',
        '仙缘草',
        '太玄仙草'
    ];
    const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sum3 = [
        0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.012, 0.011
    ];
    const baseVec = player.level_id < 36 ? sum2 : sum3;
    const mult = 1 + occFactor * 0.3;
    const amounts = baseVec.map(p => p * sum * mult);
    const msg = [Mention(userId)];
    msg.push(`\n恭喜你获得了经验${exp},草药:`);
    for (let i = 0; i < amounts.length; i++) {
        const val = Math.floor(amounts[i]);
        if (val <= 0) {
            continue;
        }
        msg.push(`\n${names[i]}${val}个`);
        await addNajieThing(userId, names[i], '草药', val);
    }
    await addExp4(userId, exp);
    if (group_id) {
        pushInfo(group_id, true, msg);
    }
    else {
        pushInfo(userId, false, msg);
    }
    return false;
}
async function mine_jiesuan(user_id, time, group_id) {
    const userId = user_id;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    const exp = time * 10;
    const occFactor = await calcOccupationFactor(player.occupation_level);
    const rate = occFactor * 10;
    const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time);
    const ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(rate * 100)}%,`;
    let end_amount = Math.floor(4 * (rate + 1) * mine_amount1);
    const num = Math.floor(((rate / 12) * time) / 30);
    const A = [
        '金色石胚',
        '棕色石胚',
        '绿色石胚',
        '红色石胚',
        '蓝色石胚',
        '金色石料',
        '棕色石料',
        '绿色石料',
        '红色石料',
        '蓝色石料'
    ];
    const B = [
        '金色妖石',
        '棕色妖石',
        '绿色妖石',
        '红色妖石',
        '蓝色妖石',
        '金色妖丹',
        '棕色妖丹',
        '绿色妖丹',
        '红色妖丹',
        '蓝色妖丹'
    ];
    const xuanze = Math.trunc(Math.random() * A.length);
    end_amount *= player.level_id / 40;
    end_amount = Math.floor(end_amount);
    await addNajieThing(userId, '庚金', '材料', end_amount);
    await addNajieThing(userId, '玄土', '材料', end_amount);
    await addNajieThing(userId, A[xuanze], '材料', num);
    await addNajieThing(userId, B[xuanze], '材料', Math.trunc(num / 48));
    await addExp4(userId, exp);
    const msg = [Mention(userId)];
    msg.push(`\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`);
    msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`);
    if (group_id) {
        pushInfo(group_id, true, msg);
    }
    else {
        pushInfo(userId, false, msg);
    }
    return false;
}

export { calcEffectiveMinutes, mine_jiesuan, plant_jiesuan };
