import { redis, pushInfo } from '../api/api.js';
import 'yaml';
import fs from 'fs';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import 'path';
import { __PATH } from '../model/paths.js';
import data from '../model/XiuxianData.js';
import { isNotNull, zd_battle, Add_najie_thing, Read_shop, Write_shop, existshop } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

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
            if (action.xijie == '0') {
                end_time = end_time - action.time + 60000 * 10;
                if (now_time >= end_time) {
                    let weizhi = action.Place_address;
                    let i;
                    for (i = 0; i < data.npc_list.length; i++) {
                        if (data.npc_list[i].name == weizhi.name) {
                            break;
                        }
                    }
                    let A_player = action.A_player;
                    let monster_length;
                    let monster_index;
                    let monster;
                    if (weizhi.Grade == 1) {
                        monster_length = data.npc_list[i].one.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].one[monster_index];
                    }
                    else if (weizhi.Grade == 2) {
                        monster_length = data.npc_list[i].two.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].two[monster_index];
                    }
                    else {
                        monster_length = data.npc_list[i].three.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].three[monster_index];
                    }
                    let B_player = {
                        名号: monster.name,
                        攻击: Math.floor(monster.atk * A_player.攻击),
                        防御: Math.floor((monster.def * A_player.防御) / (1 + weizhi.Grade * 0.05)),
                        当前血量: Math.floor((monster.blood * A_player.当前血量) / (1 + weizhi.Grade * 0.05)),
                        暴击率: monster.baoji,
                        灵根: monster.灵根,
                        法球倍率: monster.灵根.法球倍率
                    };
                    let Data_battle;
                    let last_msg = '';
                    if (A_player.魔值 == 0) {
                        Data_battle = await zd_battle(A_player, B_player);
                        last_msg += A_player.名号 + '悄悄靠近' + B_player.名号;
                        A_player.当前血量 += Data_battle.A_xue;
                    }
                    else {
                        Data_battle = await zd_battle(B_player, A_player);
                        last_msg += A_player.名号 + '杀气过重,被' + B_player.名号 + '发现了';
                        A_player.当前血量 += Data_battle.B_xue;
                    }
                    let msgg = Data_battle.msg;
                    logger.info(msgg);
                    let A_win = `${A_player.名号}击败了${B_player.名号}`;
                    let B_win = `${B_player.名号}击败了${A_player.名号}`;
                    let arr = action;
                    let time;
                    let action_time;
                    if (msgg.find(item => item == A_win)) {
                        time = 10;
                        action_time = 60000 * time;
                        arr.A_player = A_player;
                        arr.action = '搜刮';
                        arr.end_time = new Date().getTime() + action_time;
                        arr.time = action_time;
                        arr.xijie = -1;
                        last_msg +=
                            ',经过一番战斗,击败对手,剩余' +
                                A_player.当前血量 +
                                '血量,开始搜刮物品';
                    }
                    else if (msgg.find(item => item == B_win)) {
                        let num = weizhi.Grade;
                        last_msg +=
                            ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' +
                                num;
                        await Add_najie_thing(player_id, '秘境之匙', '道具', num);
                        delete arr.group_id;
                        let shop = await Read_shop();
                        for (i = 0; i < shop.length; i++) {
                            if (shop[i].name == weizhi.name) {
                                shop[i].state = 0;
                                break;
                            }
                        }
                        await Write_shop(shop);
                        time = 60;
                        action_time = 60000 * time;
                        arr.action = '禁闭';
                        arr.xijie = 1;
                        arr.end_time = new Date().getTime() + action_time;
                        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
                        const groupList = await redis.smembers(redisGlKey);
                        const xx = '【全服公告】' +
                            A_player.名号 +
                            '被' +
                            B_player.名号 +
                            '抓进了地牢,希望大家遵纪守法,引以为戒';
                        for (const group_id of groupList) {
                            pushInfo('', group_id, true, xx);
                        }
                    }
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                    msg.push('\n' + last_msg);
                    if (is_group) {
                        await pushInfo('', push_address, is_group, msg.join('\n'));
                    }
                    else {
                        await pushInfo('', player_id, is_group, msg.join('\n'));
                    }
                }
            }
            else if (action.xijie == '-1') {
                end_time = end_time - action.time + 60000 * 5;
                if (now_time >= end_time) {
                    let weizhi = action.Place_address;
                    let thing = await existshop(weizhi.name);
                    let arr = action;
                    let time;
                    let action_time;
                    let last_msg = '';
                    let thing_name = [];
                    let shop = await Read_shop();
                    let i;
                    for (i = 0; i < shop.length; i++) {
                        if (shop[i].name == weizhi.name) {
                            break;
                        }
                    }
                    if (!thing) {
                        last_msg += '已经被搬空了';
                    }
                    else {
                        let x = shop[i].Grade * 2;
                        while (x > 0 && thing != false) {
                            let t;
                            let thing_index = Math.trunc(Math.random() * thing.length);
                            t = thing[thing_index];
                            thing_name.push(t);
                            shop = await Read_shop();
                            for (let j = 0; j < shop[i].one.length; j++) {
                                if (shop[i].one[j].name == t.name && shop[i].one[j].数量 > 0) {
                                    shop[i].one[j].数量 = 0;
                                    await Write_shop(shop);
                                    break;
                                }
                            }
                            thing = await existshop(weizhi.name);
                            x--;
                        }
                        last_msg += '经过一番搜寻' + arr.A_player.名号 + '找到了';
                        for (let j = 0; j < thing_name.length; j++) {
                            last_msg += '\n' + thing_name[j].name + ' x ' + thing_name[j].数量;
                        }
                        last_msg +=
                            '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑';
                    }
                    arr.action = '逃跑';
                    time = 30;
                    action_time = 60000 * time;
                    arr.end_time = new Date().getTime() + action_time;
                    arr.time = action_time;
                    arr.xijie = -2;
                    arr.thing = thing_name;
                    arr.cishu = shop[i].Grade + 1;
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                    msg.push('\n' + last_msg);
                    if (is_group) {
                        await pushInfo('', push_address, is_group, msg.join('\n'));
                    }
                    else {
                        await pushInfo('', player_id, is_group, msg.join('\n'));
                    }
                }
            }
        }
    }
});
