import { redis } from '../api/api.js';
import config from '../model/Config.js';
import fs from 'fs';
import 'path';
import { isNotNull, Read_danyao, exist_najie_thing, Add_najie_thing, Add_修为 as Add___, Add_血气 as Add___$1, setFileValue, Write_danyao } from '../model/xiuxian.js';
import data from '../model/XiuxianData.js';
import { scheduleJob } from 'node-schedule';
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
    const cf = config.getConfig('xiuxian', 'xiuxian');
    for (let player_id of playerList) {
        let action = await redis.get('xiuxian@1.3.0:' + player_id + ':action');
        action = JSON.parse(action);
        if (action != null) {
            if (action.hasOwnProperty('group_id')) {
                if (isNotNull(action.group_id)) {
                    action.group_id;
                }
            }
            let end_time = action.end_time;
            let now_time = new Date().getTime();
            if (action.shutup == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    let player = data.getData('player', player_id);
                    let now_level_id;
                    if (!isNotNull(player.level_id)) {
                        return false;
                    }
                    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                    let size = cf.biguan.size;
                    let xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
                    let blood = Math.floor(player.血量上限 * 0.02);
                    let time = parseInt(action.time) / 1000 / 60;
                    let rand = Math.random();
                    let other_xiuwei = 0;
                    let transformation = '修为';
                    let dy = await Read_danyao(player_id);
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
                        Math.trunc(rand * time * dy.beiyong4);
                    }
                    else if (rand > 0.8) {
                        rand = Math.trunc(rand * 10) + 5;
                        other_xiuwei = -1 * rand * time;
                        Math.trunc(rand * time * dy.beiyong4);
                    }
                    let other_x = 0;
                    let qixue = 0;
                    if ((await exist_najie_thing(player_id, '魔界秘宝', '道具')) &&
                        player.魔道值 > 999) {
                        other_x += Math.trunc(xiuwei * 0.15 * time);
                        await Add_najie_thing(player_id, '魔界秘宝', '道具', -1);
                        await Add___(player_id, other_x);
                    }
                    if ((await exist_najie_thing(player_id, '神界秘宝', '道具')) &&
                        player.魔道值 < 1 &&
                        (player.灵根.type == '转生' || player.level_id > 41)) {
                        qixue = Math.trunc(xiuwei * 0.1 * time);
                        await Add_najie_thing(player_id, '神界秘宝', '道具', -1);
                        await Add___$1(player_id, qixue);
                    }
                    await setFileValue(player_id, blood * time, '当前血量');
                    if (action.acount == null) {
                        action.acount = 0;
                    }
                    let arr = action;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    delete arr.group_id;
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                    Math.trunc(xiuwei * time * dy.beiyong4);
                    if (transformation == '血气') {
                        await setFileValue(player_id, (xiuwei * time + other_xiuwei) * dy.beiyong4, transformation);
                    }
                    else {
                        await setFileValue(player_id, xiuwei * time + other_xiuwei, transformation);
                    }
                    await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
                    if (dy.lianti <= 0) {
                        dy.lianti = 0;
                        dy.beiyong4 = 0;
                    }
                    await Write_danyao(player_id, dy);
                }
            }
            if (action.working == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    let player = data.getData('player', player_id);
                    let now_level_id;
                    if (!isNotNull(player.level_id)) {
                        return false;
                    }
                    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                    let size = cf.work.size;
                    let lingshi = Math.floor(size * now_level_id * (1 + player.修炼效率提升) * 0.5);
                    let time = parseInt(action.time) / 1000 / 60;
                    let other_lingshi = 0;
                    let other_xueqi = 0;
                    let rand = Math.random();
                    if (rand < 0.2) {
                        rand = Math.trunc(rand * 10) + 40;
                        other_lingshi = rand * time;
                    }
                    else if (rand > 0.8) {
                        rand = Math.trunc(rand * 10) + 5;
                        other_lingshi = -1 * rand * time;
                    }
                    else if (rand > 0.5 && rand < 0.6) {
                        rand = Math.trunc(rand * 10) + 20;
                        other_lingshi = -1 * rand * time;
                        other_xueqi = -2 * rand * time;
                    }
                    player.血气 += other_xueqi;
                    data.setData('player', player_id, player);
                    let get_lingshi = Math.trunc(lingshi * time + other_lingshi);
                    await setFileValue(player_id, get_lingshi, '灵石');
                    if (action.acount == null) {
                        action.acount = 0;
                    }
                    let arr = action;
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
