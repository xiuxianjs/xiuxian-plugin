import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../model/DataList.js';
import { getConfig } from '../../../model/Config.js';
import { getString, userKey, setTimestamp } from '../../../model/utils/redisHelper.js';
import { notUndAndNull } from '../../../model/common.js';
import { readEquipment, writeEquipment } from '../../../model/equipment.js';
import { addExp2, addHP, addExp } from '../../../model/economy.js';
import { addNajieThing } from '../../../model/najie.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import '../../../model/api.js';
import { existplayer, readPlayer, writePlayer } from '../../../model/xiuxiandata.js';
import '../../../model/settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import '../../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';

async function useLevelUp(e, luck = false) {
    const userId = e.UserId;
    const Send = useSend(e);
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(userId);
    const levelList = await getDataList('Level1');
    if (!levelList) {
        return;
    }
    const now_level = levelList.find(item => item.level_id === player.level_id).level;
    if (now_level === '渡劫期') {
        if (player.power_place === 0) {
            void Send(Text('你已度过雷劫，请感应仙门#登仙'));
        }
        else {
            void Send(Text('请先渡劫！'));
        }
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#刷新信息'));
        return false;
    }
    const now_level_id = levelList.find(item => item.level_id === player.level_id).level_id;
    if (now_level_id >= 51
        && player.灵根.name !== '天五灵根'
        && player.灵根.name !== '垃圾五灵根'
        && player.灵根.name !== '九转轮回体'
        && player.灵根.name !== '九重魔功') {
        void Send(Text('你灵根不齐，无成帝的资格！请先夺天地之造化，修补灵根后再来突破吧'));
        return false;
    }
    if (now_level_id === 64) {
        return false;
    }
    const now_exp = player.修为;
    const needEXP = levelList.find(item => item.level_id === player.level_id).exp;
    if (now_exp < needEXP) {
        void Send(Text(`修为不足,再积累${needEXP - now_exp}修为后方可突破`));
        return false;
    }
    const cf = await getConfig('xiuxian', 'xiuxian');
    const Time = cf.CD.level_up;
    const now_Time = Date.now();
    const shuangxiuTimeout = Math.floor(60000 * Time);
    const last_time_raw = await getString(userKey(userId, 'last_Levelup_time'));
    const last_time = last_time_raw ? parseInt(last_time_raw, 10) : 0;
    if (now_Time < last_time + shuangxiuTimeout) {
        const Couple_m = Math.trunc((last_time + shuangxiuTimeout - now_Time) / 60 / 1000);
        const Couple_s = Math.trunc(((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000);
        void Send(Text(`突破正在CD中，剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    const rand = Math.random();
    let prob = 1 - now_level_id / 65;
    if (luck) {
        void Send(Text('你使用了幸运草，减少50%失败概率。'));
        prob = prob + (1 - prob) * 0.5;
        await addNajieThing(userId, '幸运草', '道具', -1);
    }
    if (player.breakthrough) {
        prob += 0.2;
        player.breakthrough = false;
        await writePlayer(userId, player);
    }
    if (rand > prob) {
        const bad_time = Math.random();
        if (bad_time > 0.9) {
            await addExp(userId, -1 * needEXP * 0.4);
            await setTimestamp(userId, 'last_Levelup_time', now_Time);
            void Send(Text('突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了' + needEXP * 0.4 + '修为'));
            return false;
        }
        else if (bad_time > 0.8) {
            await addExp(userId, -1 * needEXP * 0.2);
            await setTimestamp(userId, 'last_Levelup_time', now_Time);
            void Send(Text('突破瓶颈时想到树脂满了,险些走火入魔，丧失了' + needEXP * 0.2 + '修为'));
            return false;
        }
        else if (bad_time > 0.7) {
            await addExp(userId, -1 * needEXP * 0.1);
            await setTimestamp(userId, 'last_Levelup_time', now_Time);
            void Send(Text('突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了' + needEXP * 0.1 + '修为'));
            return false;
        }
        else if (bad_time > 0.1) {
            await setTimestamp(userId, 'last_Levelup_time', now_Time);
            void Send(Text(`突破失败，不要气馁,等到${Time}分钟后再尝试吧`));
            return false;
        }
        else {
            await addExp(userId, -1 * needEXP * 0.2);
            await setTimestamp(userId, 'last_Levelup_time', now_Time);
            void Send(Text('突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了' + needEXP * 0.2 + '修为'));
            return false;
        }
    }
    const changzhuxianchonList = await getDataList('Changzhuxianchon');
    if (now_level_id < 42) {
        const random = Math.random();
        if (random < ((now_level_id / 60) * 0.5) / 5) {
            let random2 = Math.trunc(Math.random() * changzhuxianchonList.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            void Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' + changzhuxianchonList[random2].name + '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(userId, changzhuxianchonList[random2].name, '仙宠', 1);
        }
    }
    else {
        const random = Math.random();
        if (random < (now_level_id / 60) * 0.5) {
            let random2 = Math.trunc(Math.random() * changzhuxianchonList.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            void Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' + changzhuxianchonList[random2].name + '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(userId, changzhuxianchonList[random2].name, '仙宠', 1);
        }
    }
    player.level_id = now_level_id + 1;
    player.修为 -= needEXP;
    await writePlayer(userId, player);
    const equipment = await readEquipment(userId);
    await writeEquipment(userId, equipment);
    await addHP(userId, 999999999999);
    const level = levelList.find(item => item.level_id === player.level_id).level;
    void Send(Text(`突破成功,当前境界为${level}`));
    await setTimestamp(userId, 'last_Levelup_time', now_Time);
    return false;
}
async function userLevelMaxUp(e, luck) {
    const userId = e.UserId;
    const Send = useSend(e);
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const game_action = await getString(userKey(userId, 'game_action'));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(userId);
    if (!notUndAndNull(player.Physique_id)) {
        void Send(Text('请先#刷新信息'));
        return false;
    }
    const levelMaxList = await getDataList('Level2');
    const now_level_id = levelMaxList.find(item => item.level_id === player.Physique_id).level_id;
    const now_exp = player.血气;
    const needEXP = levelMaxList.find(item => item.level_id === player.Physique_id).exp;
    if (now_exp < needEXP) {
        void Send(Text(`血气不足,再积累${needEXP - now_exp}血气后方可突破`));
        return false;
    }
    if (now_level_id === 60) {
        void Send(Text('你已突破至最高境界'));
        return false;
    }
    const cf = await getConfig('xiuxian', 'xiuxian');
    const Time = cf.CD.level_up;
    const now_Time = Date.now();
    const shuangxiuTimeout = Math.floor(60000 * Time);
    const last_time_raw2 = await getString(userKey(userId, 'last_LevelMaxup_time'));
    const last_time = last_time_raw2 ? Math.floor(Number(last_time_raw2)) : 0;
    if (now_Time < last_time + shuangxiuTimeout) {
        const Couple_m = Math.trunc((last_time + shuangxiuTimeout - now_Time) / 60 / 1000);
        const Couple_s = Math.trunc(((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000);
        void Send(Text(`突破正在CD中，剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    const rand = Math.random();
    let prob = 1 - now_level_id / 60;
    if (luck) {
        void Send(Text('你使用了幸运草，减少50%失败概率。'));
        prob = prob + (1 - prob) * 0.5;
        await addNajieThing(userId, '幸运草', '道具', -1);
    }
    if (rand > prob) {
        const bad_time = Math.random();
        if (bad_time > 0.9) {
            await addExp2(userId, -1 * needEXP * 0.4);
            await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
            void Send(Text('突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了' + needEXP * 0.4 + '血气'));
            return false;
        }
        else if (bad_time > 0.8) {
            await addExp2(userId, -1 * needEXP * 0.2);
            await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
            void Send(Text('突破瓶颈时想到树脂满了,险些走火入魔，丧失了' + needEXP * 0.2 + '血气'));
            return false;
        }
        else if (bad_time > 0.7) {
            await addExp2(userId, -1 * needEXP * 0.1);
            await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
            void Send(Text('突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了' + needEXP * 0.1 + '血气'));
            return false;
        }
        else if (bad_time > 0.1) {
            await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
            void Send(Text(`破体失败，不要气馁,等到${Time}分钟后再尝试吧`));
            return false;
        }
        else {
            await addExp2(userId, -1 * needEXP * 0.2);
            await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
            void Send(Text('突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了' + needEXP * 0.2 + '血气'));
            return false;
        }
    }
    const changzhuxianchonList2 = await getDataList('Changzhuxianchon');
    if (now_level_id < 42) {
        const random = Math.random();
        if (random < ((now_level_id / 60) * 0.5) / 5) {
            let random2 = Math.trunc(Math.random() * changzhuxianchonList2.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            void Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' + changzhuxianchonList2[random2].name + '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(userId, changzhuxianchonList2[random2].name, '仙宠', 1);
        }
    }
    else {
        const random = Math.random();
        if (random < (now_level_id / 60) * 0.5) {
            let random2 = Math.trunc(Math.random() * changzhuxianchonList2.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            void Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' + changzhuxianchonList2[random2].name + '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(userId, changzhuxianchonList2[random2].name, '仙宠', 1);
        }
    }
    player.Physique_id = now_level_id + 1;
    player.血气 -= needEXP;
    await writePlayer(userId, player);
    const equipment = await readEquipment(userId);
    await writeEquipment(userId, equipment);
    await addHP(userId, 999999999999);
    const level = levelMaxList.find(item => item.level_id === player.Physique_id).level;
    void Send(Text(`突破成功至${level}`));
    await setTimestamp(userId, 'last_LevelMaxup_time', now_Time);
    return false;
}

export { useLevelUp, userLevelMaxUp };
