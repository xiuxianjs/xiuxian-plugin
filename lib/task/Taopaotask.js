import { redis, pushInfo } from '../api/api.js';
import 'yaml';
import fs from 'fs';
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
import { __PATH } from '../model/paths.js';
import data from '../model/XiuxianData.js';
import { isNotNull, Harm, Read_shop, Add_najie_thing, Write_shop } from '../model/xiuxian.js';
import { scheduleJob } from 'node-schedule';

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
            if (action.xijie == '-2') {
                end_time = end_time - action.time + 60000 * 5;
                if (now_time >= end_time) {
                    let weizhi = action.Place_address;
                    let i;
                    for (i = 0; i < data.npc_list.length; i++) {
                        if (data.npc_list[i].name == '万仙盟') {
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
                    let Random = Math.random();
                    let npc_damage = Math.trunc(Harm(B_player.攻击 * 0.85, A_player.防御) +
                        Math.trunc(B_player.攻击 * B_player.法球倍率) +
                        B_player.防御 * 0.1);
                    let last_msg = '';
                    if (Random < 0.1) {
                        A_player.当前血量 -= npc_damage;
                        last_msg +=
                            B_player.名号 +
                                '似乎不屑追你,只是随手丢出神通,剩余血量' +
                                A_player.当前血量;
                    }
                    else if (Random < 0.25) {
                        A_player.当前血量 -= Math.trunc(npc_damage * 0.3);
                        last_msg +=
                            '你引起了' +
                                B_player.名号 +
                                '的兴趣,' +
                                B_player.名号 +
                                '决定试探你,只用了三分力,剩余血量' +
                                A_player.当前血量;
                    }
                    else if (Random < 0.5) {
                        A_player.当前血量 -= Math.trunc(npc_damage * 1.5);
                        last_msg +=
                            '你的逃跑让' +
                                B_player.名号 +
                                '愤怒,' +
                                B_player.名号 +
                                '使用了更加强大的一次攻击,剩余血量' +
                                A_player.当前血量;
                    }
                    else if (Random < 0.7) {
                        A_player.当前血量 -= Math.trunc(npc_damage * 1.3);
                        last_msg +=
                            '你成功的吸引了所有的仇恨,' +
                                B_player.名号 +
                                '已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量' +
                                A_player.当前血量;
                    }
                    else if (Random < 0.9) {
                        A_player.当前血量 -= Math.trunc(npc_damage * 1.8);
                        last_msg +=
                            '你们近乎贴脸飞行,' +
                                B_player.名号 +
                                '的攻势愈加猛烈,已经快招架不住了,剩余血量' +
                                A_player.当前血量;
                    }
                    else {
                        A_player.当前血量 -= Math.trunc(npc_damage * 0.5);
                        last_msg +=
                            '身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量' +
                                A_player.当前血量;
                    }
                    if (A_player.当前血量 < 0) {
                        A_player.当前血量 = 0;
                    }
                    let arr = action;
                    let shop = await Read_shop();
                    for (i = 0; i < shop.length; i++) {
                        if (shop[i].name == weizhi.name) {
                            shop[i].state = 0;
                            break;
                        }
                    }
                    if (A_player.当前血量 > 0) {
                        arr.A_player = A_player;
                        arr.cishu--;
                        arr.A_player = A_player;
                    }
                    else {
                        let num = weizhi.Grade + 1;
                        last_msg +=
                            '\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x' +
                                num;
                        await Add_najie_thing(player_id, '秘境之匙', '道具', num);
                        delete arr.group_id;
                        shop[i].state = 0;
                        await Write_shop(shop);
                        let time = 60;
                        let action_time = 60000 * time;
                        arr.action = '天牢';
                        arr.xijie = 1;
                        arr.end_time = new Date().getTime() + action_time;
                        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
                        const groupList = await redis.smembers(redisGlKey);
                        '【全服公告】' +
                            A_player.名号 +
                            '被' +
                            B_player.名号 +
                            '抓进了地牢,希望大家遵纪守法,引以为戒';
                        for (const group_id of groupList) {
                        }
                    }
                    if (arr.cishu == 0) {
                        last_msg += '\n你成功躲过了万仙盟的追杀,躲进了宗门';
                        arr.xijie = 1;
                        arr.end_time = new Date().getTime();
                        delete arr.group_id;
                        for (let j = 0; j < arr.thing.length; j++) {
                            await Add_najie_thing(player_id, arr.thing[j].name, arr.thing[j].class, arr.thing[j].数量);
                            last_msg += '';
                        }
                        shop[i].Grade++;
                        if (shop[i].Grade > 3) {
                            shop[i].Grade = 3;
                        }
                        shop[i].state = 0;
                        await Write_shop(shop);
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
        }
    }
});
