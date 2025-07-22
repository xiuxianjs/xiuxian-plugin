import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { redis, pushInfo } from '../api/api.js';
import 'yaml';
import '../config/help/Association.yaml.js';
import '../config/help/help.yaml.js';
import '../config/help/helpcopy.yaml.js';
import '../config/help/set.yaml.js';
import '../config/help/shituhelp.yaml.js';
import '../config/parameter/namelist.yaml.js';
import '../config/task/task.yaml.js';
import '../config/version/version.yaml.js';
import '../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { isNotNull, Add_职业经验 as Add_____, Add_najie_thing } from '../model/xiuxian.js';
import data from '../model/XiuxianData.js';
import { __PATH } from '../model/paths.js';

scheduleJob('0 0/1 * * * ?', async () => {
    let playerList = [];
    let files = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let action = await redis.get('xiuxian@1.3.0:' + player_id + ':action');
        action = JSON.parse(action);
        if (action != null) {
            let push_address;
            let is_group = false;
            if (action.hasOwnProperty('group_id')) {
                if (isNotNull(action.group_id)) {
                    is_group = true;
                    push_address = action.group_id;
                }
            }
            let end_time = action.end_time;
            let now_time = new Date().getTime();
            if (action.plant == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    let player = data.getData('player', player_id);
                    let time = parseInt(action.time) / 1000 / 60;
                    let exp = time * 10;
                    await Add_____(player_id, exp);
                    let k = 1;
                    if (player.level_id < 22) {
                        k = 0.5;
                    }
                    let sum = (time / 480) * (player.occupation_level * 2 + 12) * k;
                    if (player.level_id >= 36) {
                        sum = (time / 480) * (player.occupation_level * 3 + 11);
                    }
                    let names = [
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
                        0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024,
                        0.024, 0.024, 0.012, 0.011
                    ];
                    let msg = [];
                    msg.push(`\n恭喜你获得了经验${exp},草药:`);
                    let newsum = sum3.map(item => item * sum);
                    if (player.level_id < 36) {
                        newsum = sum2.map(item => item * sum);
                    }
                    for (let item in sum3) {
                        if (newsum[item] < 1) {
                            continue;
                        }
                        msg.push(`\n${names[item]}${Math.floor(newsum[item])}个`);
                        await Add_najie_thing(player_id, names[item], '草药', Math.floor(newsum[item]));
                    }
                    await Add_____(player_id, exp);
                    let arr = action;
                    arr.plant = 1;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    delete arr.group_id;
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                    if (is_group) {
                        await pushInfo(push_address, is_group, msg);
                    }
                    else {
                        await pushInfo(player_id, is_group, msg);
                    }
                }
            }
            if (action.mine == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    let player = data.getData('player', player_id);
                    if (!isNotNull(player.level_id)) {
                        return false;
                    }
                    let time = parseInt(action.time) / 1000 / 60;
                    let mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time);
                    let rate = data.occupation_exp_list.find(item => item.id == player.occupation_level).rate * 10;
                    let exp = 0;
                    exp = time * 10;
                    let end_amount = Math.floor(4 * (rate + 1) * mine_amount1);
                    let num = Math.floor(((rate / 12) * time) / 30);
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
                    let xuanze = Math.trunc(Math.random() * A.length);
                    end_amount *= player.level_id / 40;
                    end_amount = Math.floor(end_amount);
                    await Add_najie_thing(player_id, '庚金', '材料', end_amount);
                    await Add_najie_thing(player_id, '玄土', '材料', end_amount);
                    await Add_najie_thing(player_id, A[xuanze], '材料', num);
                    await Add_najie_thing(player_id, B[xuanze], '材料', Math.trunc(num / 48));
                    await Add_____(player_id, exp);
                    let arr = action;
                    arr.mine = 1;
                    arr.mine = 1;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    delete arr.group_id;
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                }
            }
        }
    }
});
