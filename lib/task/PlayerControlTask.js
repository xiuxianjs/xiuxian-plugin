import { redis, pushInfo } from '../model/api.js';
import { notUndAndNull } from '../model/common.js';
import { readDanyao, writeDanyao } from '../model/danyao.js';
import { existNajieThing, addNajieThing } from '../model/najie.js';
import { addExp, addExp2 } from '../model/economy.js';
import { setFileValue } from '../model/cultivation.js';
import { __PATH } from '../model/paths.js';
import { scheduleJob } from 'node-schedule';
import { Mention } from 'alemonjs';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import config from '../model/Config.js';
import data from '../model/XiuxianData.js';

scheduleJob('0 0/1 * * * ?', async () => {
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    const cf = config.getConfig('xiuxian', 'xiuxian');
    for (const player_id of playerList) {
        const actionRaw = await getDataByUserId(player_id, 'action');
        let action = null;
        try {
            action = actionRaw ? JSON.parse(actionRaw) : null;
        }
        catch {
            action = null;
        }
        if (action != null) {
            let push_address;
            let is_group = false;
            if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
                if (notUndAndNull(action.group_id)) {
                    is_group = true;
                    push_address = action.group_id;
                }
            }
            const msg = [Mention(player_id)];
            let end_time = action.end_time;
            const now_time = Date.now();
            if (action.shutup == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    const player = await data.getData('player', player_id);
                    if (!notUndAndNull(player.level_id)) {
                        return false;
                    }
                    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                    const size = cf.biguan.size;
                    const xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
                    const blood = Math.floor(player.血量上限 * 0.02);
                    const rawTime = action.time;
                    const time = (typeof rawTime === 'number'
                        ? rawTime
                        : parseInt(rawTime || '0', 10)) /
                        1000 /
                        60;
                    let rand = Math.random();
                    let xueqi = 0;
                    let other_xiuwei = 0;
                    let transformation = '修为';
                    const dy = await readDanyao(player_id);
                    if (dy.biguan > 0) {
                        dy.biguan--;
                        if (dy.biguan == 0) {
                            dy.biguanxl = 0;
                        }
                    }
                    if (dy.lianti > 0) {
                        transformation = '血气';
                        dy.lianti--;
                    }
                    if (rand < 0.2) {
                        rand = Math.trunc(rand * 10) + 45;
                        other_xiuwei = rand * time;
                        xueqi = Math.trunc(rand * time * dy.beiyong4);
                        if (transformation == '血气') {
                            msg.push('\n本次闭关顿悟,受到炼神之力修正,额外增加血气:' + xueqi);
                        }
                        else {
                            msg.push('\n本次闭关顿悟,额外增加修为:' + rand * time);
                        }
                    }
                    else if (rand > 0.8) {
                        rand = Math.trunc(rand * 10) + 5;
                        other_xiuwei = -1 * rand * time;
                        xueqi = Math.trunc(rand * time * dy.beiyong4);
                        if (transformation == '血气') {
                            msg.push('\n,由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降' +
                                xueqi);
                        }
                        else {
                            msg.push('\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降' +
                                rand * time);
                        }
                    }
                    let other_x = 0;
                    let qixue = 0;
                    if ((await existNajieThing(player_id, '魔界秘宝', '道具')) &&
                        player.魔道值 > 999) {
                        other_x += Math.trunc(xiuwei * 0.15 * time);
                        await addNajieThing(player_id, '魔界秘宝', '道具', -1);
                        msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为');
                        await addExp(player_id, other_x);
                    }
                    if ((await existNajieThing(player_id, '神界秘宝', '道具')) &&
                        player.魔道值 < 1 &&
                        (player.灵根.type == '转生' || player.level_id > 41)) {
                        qixue = Math.trunc(xiuwei * 0.1 * time);
                        await addNajieThing(player_id, '神界秘宝', '道具', -1);
                        msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气');
                        await addExp2(player_id, qixue);
                    }
                    await setFileValue(player_id, blood * time, '当前血量');
                    if (action.acount == null) {
                        action.acount = 0;
                    }
                    const arr = action;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    delete arr.group_id;
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    xueqi = Math.trunc(xiuwei * time * dy.beiyong4);
                    if (transformation == '血气') {
                        await setFileValue(player_id, (xiuwei * time + other_xiuwei) * dy.beiyong4, transformation);
                        msg.push('\n受到炼神之力的影响,增加气血:' + xueqi, '血量增加:' + blood * time);
                    }
                    else {
                        await setFileValue(player_id, xiuwei * time + other_xiuwei, transformation);
                        msg.push('\n增加修为:' + xiuwei * time, '血量增加:' + blood * time);
                    }
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    if (is_group) {
                        await pushInfo(push_address, is_group, msg);
                    }
                    else {
                        await pushInfo(player_id, is_group, msg);
                    }
                    if (dy.lianti <= 0) {
                        dy.lianti = 0;
                        dy.beiyong4 = 0;
                    }
                    await writeDanyao(player_id, dy);
                }
            }
            if (action.working == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    const player = await data.getData('player', player_id);
                    if (!notUndAndNull(player.level_id)) {
                        return false;
                    }
                    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                    const size = cf.work.size;
                    const lingshi = Math.floor(size * now_level_id * (1 + player.修炼效率提升) * 0.5);
                    const rawTime2 = action.time;
                    const time = (typeof rawTime2 === 'number'
                        ? rawTime2
                        : parseInt(rawTime2 || '0', 10)) /
                        1000 /
                        60;
                    let other_lingshi = 0;
                    let other_xueqi = 0;
                    let rand = Math.random();
                    if (rand < 0.2) {
                        rand = Math.trunc(rand * 10) + 40;
                        other_lingshi = rand * time;
                        msg.push('\n降妖路上途径金银坊，一时手痒入场一掷：6 6 6，额外获得灵石' +
                            rand * time);
                    }
                    else if (rand > 0.8) {
                        rand = Math.trunc(rand * 10) + 5;
                        other_lingshi = -1 * rand * time;
                        msg.push('\n途径盗宝团营地，由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少' +
                            rand * time);
                    }
                    else if (rand > 0.5 && rand < 0.6) {
                        rand = Math.trunc(rand * 10) + 20;
                        other_lingshi = -1 * rand * time;
                        other_xueqi = -2 * rand * time;
                        msg.push('\n归来途中经过怡红院，你抵挡不住诱惑，进去大肆消费了' +
                            rand * time +
                            '灵石，' +
                            '早上醒来，气血消耗了' +
                            2 * rand * time);
                    }
                    player.血气 += other_xueqi;
                    data.setData('player', player_id, player);
                    const get_lingshi = Math.trunc(lingshi * time + other_lingshi);
                    await setFileValue(player_id, get_lingshi, '灵石');
                    if (action.acount == null) {
                        action.acount = 0;
                    }
                    const arr = action;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    delete arr.group_id;
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    msg.push('\n降妖得到' + get_lingshi + '灵石');
                    if (is_group) {
                        await pushInfo(push_address, is_group, msg);
                    }
                    else {
                        await pushInfo(player_id, is_group, msg);
                    }
                }
            }
        }
    }
});
