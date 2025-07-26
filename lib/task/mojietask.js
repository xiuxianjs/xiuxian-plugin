import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { pushInfo } from '../api/api.js';
import '../model/Config.js';
import 'path';
import { __PATH } from '../model/paths.js';
import data from '../model/XiuxianData.js';
import { isNotNull, readPlayer, existNajieThing, addNajieThing, Add_血气 as Add___, Add_修为 as Add___$1, Read_temp, Write_temp } from '../model/xiuxian.js';
import 'dayjs';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';

scheduleJob('0 0/5 * * * ?', async () => {
    let playerList = [];
    let files = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let action = await getDataByUserId(player_id, 'action');
        action = await JSON.parse(action);
        if (action != null) {
            let push_address;
            let is_group = false;
            if (await action.hasOwnProperty('group_id')) {
                if (isNotNull(action.group_id)) {
                    is_group = true;
                    push_address = action.group_id;
                }
            }
            let msg = [];
            let end_time = action.end_time;
            let now_time = new Date().getTime();
            let player = await readPlayer(player_id);
            if (action.mojie == '0') {
                end_time = end_time - action.time;
                if (now_time > end_time) {
                    let thing_name;
                    let thing_class;
                    let x = 0.98;
                    let random1 = Math.random();
                    let y = 0.4;
                    let random2 = Math.random();
                    let z = 0.15;
                    let random3 = Math.random();
                    let random4;
                    let m = '';
                    let n = 1;
                    let t1;
                    let t2;
                    let last_msg = '';
                    let fyd_msg = '';
                    if (random1 <= x) {
                        if (random2 <= y) {
                            if (random3 <= z) {
                                random4 = Math.floor(Math.random() * data.mojie[0].three.length);
                                thing_name = data.mojie[0].three[random4].name;
                                thing_class = data.mojie[0].three[random4].class;
                                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${thing_name}]`;
                                t1 = 2 + Math.random();
                                t2 = 2 + Math.random();
                            }
                            else {
                                random4 = Math.floor(Math.random() * data.mojie[0].two.length);
                                thing_name = data.mojie[0].two[random4].name;
                                thing_class = data.mojie[0].two[random4].class;
                                m = `在洞穴中拿到[${thing_name}]`;
                                t1 = 1 + Math.random();
                                t2 = 1 + Math.random();
                            }
                        }
                        else {
                            random4 = Math.floor(Math.random() * data.mojie[0].one.length);
                            thing_name = data.mojie[0].one[random4].name;
                            thing_class = data.mojie[0].one[random4].class;
                            m = `捡到了[${thing_name}]`;
                            t1 = 0.5 + Math.random() * 0.5;
                            t2 = 0.5 + Math.random() * 0.5;
                        }
                    }
                    else {
                        thing_name = '';
                        thing_class = '';
                        m = '走在路上都没看见一只蚂蚁！';
                        t1 = 2 + Math.random();
                        t2 = 2 + Math.random();
                    }
                    let random = Math.random();
                    if (random < player.幸运) {
                        if (random < player.addluckyNo) {
                            last_msg += '福源丹生效，所以在';
                        }
                        else if (player.仙宠.type == '幸运') {
                            last_msg += '仙宠使你在探索中欧气满满，所以在';
                        }
                        n++;
                        last_msg += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';
                    }
                    if (player.islucky > 0) {
                        player.islucky--;
                        if (player.islucky != 0) {
                            fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
                        }
                        else {
                            fyd_msg = `  \n本次探索后，福源丹已失效\n`;
                            player.幸运 -= player.addluckyNo;
                            player.addluckyNo = 0;
                        }
                        await data.setData('player', player_id, player);
                    }
                    let now_level_id;
                    let now_physique_id;
                    now_level_id = player.level_id;
                    now_physique_id = player.Physique_id;
                    let qixue = 0;
                    let xiuwei = 0;
                    xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
                    qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
                    if (await existNajieThing(player_id, '修魔丹', '道具')) {
                        xiuwei *= 100;
                        xiuwei = Math.trunc(xiuwei);
                        await addNajieThing(player_id, '修魔丹', '道具', -1);
                    }
                    if (await existNajieThing(player_id, '血魔丹', '道具')) {
                        qixue *= 18;
                        qixue = Math.trunc(qixue);
                        await addNajieThing(player_id, '血魔丹', '道具', -1);
                    }
                    if (thing_name != '' || thing_class != '') {
                        await addNajieThing(player_id, thing_name, thing_class, n);
                    }
                    last_msg +=
                        m +
                            ',获得修为' +
                            xiuwei +
                            ',气血' +
                            qixue +
                            ',剩余次数' +
                            (action.cishu - 1);
                    msg.push('\n' + player.名号 + last_msg + fyd_msg);
                    let arr = action;
                    if (arr.cishu == 1) {
                        arr.shutup = 1;
                        arr.working = 1;
                        arr.power_up = 1;
                        arr.Place_action = 1;
                        arr.Place_actionplus = 1;
                        ((arr.mojie = 1),
                            (arr.end_time = new Date().getTime()));
                        delete arr.group_id;
                        await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                        await Add___(player_id, qixue);
                        await Add___$1(player_id, xiuwei);
                        const [platform, address] = push_address.split(':');
                        await pushInfo(platform, address, is_group, msg.join(''));
                    }
                    else {
                        arr.cishu--;
                        await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                        await Add___(player_id, qixue);
                        await Add___$1(player_id, xiuwei);
                        try {
                            let temp = await Read_temp();
                            let p = {
                                msg: player.名号 + last_msg + fyd_msg,
                                qq_group: push_address
                            };
                            temp.push(p);
                            await Write_temp(temp);
                        }
                        catch {
                            await Write_temp([]);
                            let temp = await Read_temp();
                            let p = {
                                msg: player.名号 + last_msg + fyd_msg,
                                qq: player_id,
                                qq_group: push_address
                            };
                            temp.push(p);
                            await Write_temp(temp);
                        }
                    }
                }
            }
        }
    }
});
