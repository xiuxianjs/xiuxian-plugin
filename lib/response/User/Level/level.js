import { useSend, Text } from 'alemonjs';
import '../../../model/api.js';
import { getString, userKey, setTimestamp } from '../../../model/utils/redisHelper.js';
import { notUndAndNull } from '../../../model/common.js';
import { readEquipment, writeEquipment } from '../../../model/equipment.js';
import { addExp2, addHP, addExp } from '../../../model/economy.js';
import { addNajieThing } from '../../../model/najie.js';
import { existplayer, readPlayer } from '../../../model/xiuxian_impl.js';
import data from '../../../model/XiuxianData.js';
import config from '../../../model/Config.js';
import { writePlayer } from '../../../model/pub.js';

async function Level_up(e, luck = false) {
    const usr_qq = e.UserId;
    const Send = useSend(e);
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const game_action = await getString(userKey(usr_qq, 'game_action'));
    if (game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    const now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
    if (now_level == '渡劫期') {
        if (player.power_place == 0) {
            Send(Text('你已度过雷劫，请感应仙门#登仙'));
        }
        else {
            Send(Text(`请先渡劫！`));
        }
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#刷新信息'));
        return false;
    }
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id >= 51 &&
        player.灵根.name != '天五灵根' &&
        player.灵根.name != '垃圾五灵根' &&
        player.灵根.name != '九转轮回体' &&
        player.灵根.name != '九重魔功') {
        Send(Text(`你灵根不齐，无成帝的资格！请先夺天地之造化，修补灵根后再来突破吧`));
        return false;
    }
    if (now_level_id == 64) {
        return false;
    }
    const now_exp = player.修为;
    const need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
    if (now_exp < need_exp) {
        Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可突破`));
        return false;
    }
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const Time = cf.CD.level_up;
    const now_Time = Date.now();
    const shuangxiuTimeout = Math.floor(60000 * Time);
    const last_time_raw = await getString(userKey(usr_qq, 'last_Levelup_time'));
    const last_time = last_time_raw ? parseInt(last_time_raw, 10) : 0;
    if (now_Time < last_time + shuangxiuTimeout) {
        const Couple_m = Math.trunc((last_time + shuangxiuTimeout - now_Time) / 60 / 1000);
        const Couple_s = Math.trunc(((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text('突破正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    const rand = Math.random();
    let prob = 1 - now_level_id / 65;
    if (luck) {
        Send(Text('你使用了幸运草，减少50%失败概率。'));
        prob = prob + (1 - prob) * 0.5;
        await addNajieThing(usr_qq, '幸运草', '道具', -1);
    }
    if (player.breakthrough) {
        prob += 0.2;
        player.breakthrough = false;
        await writePlayer(usr_qq, player);
    }
    if (rand > prob) {
        const bad_time = Math.random();
        if (bad_time > 0.9) {
            await addExp(usr_qq, -1 * need_exp * 0.4);
            await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
            Send(Text(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` +
                need_exp * 0.4 +
                '修为'));
            return false;
        }
        else if (bad_time > 0.8) {
            await addExp(usr_qq, -1 * need_exp * 0.2);
            await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
            Send(Text(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` +
                need_exp * 0.2 +
                '修为'));
            return false;
        }
        else if (bad_time > 0.7) {
            await addExp(usr_qq, -1 * need_exp * 0.1);
            await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
            Send(Text(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` +
                need_exp * 0.1 +
                '修为'));
            return false;
        }
        else if (bad_time > 0.1) {
            await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
            Send(Text(`突破失败，不要气馁,等到${Time}分钟后再尝试吧`));
            return false;
        }
        else {
            await addExp(usr_qq, -1 * need_exp * 0.2);
            await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
            Send(Text(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` +
                need_exp * 0.2 +
                '修为'));
            return false;
        }
    }
    if (now_level_id < 42) {
        const random = Math.random();
        if (random < ((now_level_id / 60) * 0.5) / 5) {
            let random2 = Math.trunc(Math.random() * data.changzhuxianchon.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' +
                data.changzhuxianchon[random2].name +
                '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(usr_qq, data.changzhuxianchon[random2].name, '仙宠', 1);
        }
    }
    else {
        const random = Math.random();
        if (random < (now_level_id / 60) * 0.5) {
            let random2 = Math.trunc(Math.random() * data.changzhuxianchon.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' +
                data.changzhuxianchon[random2].name +
                '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(usr_qq, data.changzhuxianchon[random2].name, '仙宠', 1);
        }
    }
    player.level_id = now_level_id + 1;
    player.修为 -= need_exp;
    await writePlayer(usr_qq, player);
    const equipment = await readEquipment(usr_qq);
    await writeEquipment(usr_qq, equipment);
    await addHP(usr_qq, 999999999999);
    const level = data.Level_list.find(item => item.level_id == player.level_id).level;
    Send(Text(`突破成功,当前境界为${level}`));
    await setTimestamp(usr_qq, 'last_Levelup_time', now_Time);
    return false;
}
async function LevelMax_up(e, luck) {
    const usr_qq = e.UserId;
    const Send = useSend(e);
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const game_action = await getString(userKey(usr_qq, 'game_action'));
    if (game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!notUndAndNull(player.Physique_id)) {
        Send(Text('请先#刷新信息'));
        return false;
    }
    const now_level_id = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level_id;
    const now_exp = player.血气;
    const need_exp = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
    if (now_exp < need_exp) {
        Send(Text(`血气不足,再积累${need_exp - now_exp}血气后方可突破`));
        return false;
    }
    if (now_level_id == 60) {
        Send(Text(`你已突破至最高境界`));
        return false;
    }
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const Time = cf.CD.level_up;
    const now_Time = Date.now();
    const shuangxiuTimeout = Math.floor(60000 * Time);
    const last_time_raw2 = await getString(userKey(usr_qq, 'last_LevelMaxup_time'));
    const last_time = last_time_raw2 ? Math.floor(Number(last_time_raw2)) : 0;
    if (now_Time < last_time + shuangxiuTimeout) {
        const Couple_m = Math.trunc((last_time + shuangxiuTimeout - now_Time) / 60 / 1000);
        const Couple_s = Math.trunc(((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text('突破正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    const rand = Math.random();
    let prob = 1 - now_level_id / 60;
    if (luck) {
        Send(Text('你使用了幸运草，减少50%失败概率。'));
        prob = prob + (1 - prob) * 0.5;
        await addNajieThing(usr_qq, '幸运草', '道具', -1);
    }
    if (rand > prob) {
        const bad_time = Math.random();
        if (bad_time > 0.9) {
            await addExp2(usr_qq, -1 * need_exp * 0.4);
            await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
            Send(Text(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` +
                need_exp * 0.4 +
                '血气'));
            return false;
        }
        else if (bad_time > 0.8) {
            await addExp2(usr_qq, -1 * need_exp * 0.2);
            await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
            Send(Text(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` +
                need_exp * 0.2 +
                '血气'));
            return false;
        }
        else if (bad_time > 0.7) {
            await addExp2(usr_qq, -1 * need_exp * 0.1);
            await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
            Send(Text(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` +
                need_exp * 0.1 +
                '血气'));
            return false;
        }
        else if (bad_time > 0.1) {
            await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
            Send(Text(`破体失败，不要气馁,等到${Time}分钟后再尝试吧`));
            return false;
        }
        else {
            await addExp2(usr_qq, -1 * need_exp * 0.2);
            await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
            Send(Text(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` +
                need_exp * 0.2 +
                '血气'));
            return false;
        }
    }
    if (now_level_id < 42) {
        const random = Math.random();
        if (random < ((now_level_id / 60) * 0.5) / 5) {
            let random2 = Math.trunc(Math.random() * data.changzhuxianchon.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' +
                data.changzhuxianchon[random2].name +
                '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(usr_qq, data.changzhuxianchon[random2].name, '仙宠', 1);
        }
    }
    else {
        const random = Math.random();
        if (random < (now_level_id / 60) * 0.5) {
            let random2 = Math.trunc(Math.random() * data.changzhuxianchon.length);
            random2 = (Math.ceil((random2 + 1) / 5) - 1) * 5;
            Send(Text('修仙本是逆天而行,神明愿意降下自己的恩泽.这只[' +
                data.changzhuxianchon[random2].name +
                '],将伴随与你,愿你修仙路上不再独身一人.`'));
            await addNajieThing(usr_qq, data.changzhuxianchon[random2].name, '仙宠', 1);
        }
    }
    player.Physique_id = now_level_id + 1;
    player.血气 -= need_exp;
    await writePlayer(usr_qq, player);
    const equipment = await readEquipment(usr_qq);
    await writeEquipment(usr_qq, equipment);
    await addHP(usr_qq, 999999999999);
    const level = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    Send(Text(`突破成功至${level}`));
    await setTimestamp(usr_qq, 'last_LevelMaxup_time', now_Time);
    return false;
}

export { LevelMax_up, Level_up };
