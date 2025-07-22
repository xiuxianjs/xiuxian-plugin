import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { redis } from '../api/api.js';
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
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'jsxp';
import 'react';
import '../resources/html/adminset/adminset.css.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/state/state.jpg.js';
import '../resources/img/state/user_state.png.js';
import '../resources/html/association/association.css.js';
import '../resources/img/player/player.jpg.js';
import '../resources/html/danfang/danfang.css.js';
import '../resources/img/danfang/danfang.jpg.js';
import '../resources/html/gongfa/gongfa.css.js';
import '../resources/font/NZBZ.ttf.js';
import '../resources/html/equipment/equipment.css.js';
import '../resources/img/equipment_pifu/0.jpg.js';
import '../resources/html/fairyrealm/fairyrealm.css.js';
import '../resources/img/fairyrealm/fairyrealm.jpg.js';
import '../resources/img/fairyrealm/card.jpg.js';
import '../resources/html/forbidden_area/forbidden_area.css.js';
import '../resources/img/forbidden_area/forbidden_area.jpg.js';
import '../resources/img/forbidden_area/card.jpg.js';
import '../resources/html/supermarket/supermarket.css.js';
import '../resources/img/supermarket/supermarket.jpg.js';
import '../resources/html/state/state.css.js';
import '../resources/html/help/common.css.js';
import '../resources/html/help/help.css.js';
import '../resources/img/help/xiuxian.jpg.js';
import '../resources/img/help/icon.png.js';
import '../resources/html/log/log.css.js';
import '../resources/img/najie/najie.jpg.js';
import '../resources/html/ningmenghome/ningmenghome.css.js';
import '../resources/img/ningmenghome/ningmenghome.jpg.js';
import '../resources/html/najie/najie.css.js';
import '../resources/img/player_pifu/0.jpg.js';
import '../resources/html/player/player.css.js';
import '../resources/img/player/user_state.png.js';
import '../resources/html/playercopy/player.css.js';
import '../resources/html/secret_place/secret_place.css.js';
import '../resources/img/secret_place/secret_place.jpg.js';
import '../resources/img/secret_place/card.jpg.js';
import '../resources/html/shenbing/shenbing.css.js';
import '../resources/html/shifu/shifu.css.js';
import '../resources/html/shitu/shitu.css.js';
import '../resources/html/shituhelp/common.css.js';
import '../resources/html/shituhelp/shituhelp.css.js';
import '../resources/font/华文中宋x.ttf.js';
import '../resources/font/HYWH-85W.ttf.js';
import '../resources/font/HYWH-65W.ttf.js';
import '../resources/img/help/shituhelp.jpg.js';
import '../resources/html/shop/shop.css.js';
import '../resources/html/statezhiye/statezhiye.css.js';
import '../resources/html/sudoku/sudoku.css.js';
import '../resources/html/talent/talent.css.js';
import '../resources/img/talent/talent.jpg.js';
import '../resources/html/temp/temp.css.js';
import '../resources/html/time_place/time_place.css.js';
import '../resources/img/time_place/time_place.jpg.js';
import '../resources/html/tujian/tujian.css.js';
import '../resources/html/tuzhi/tuzhi.css.js';
import '../resources/img/tuzhi/tuzhi.jpg.js';
import '../resources/html/valuables/valuables.css.js';
import '../resources/img/valuables/valuables-top.jpg.js';
import '../resources/img/valuables/valuables-danyao.jpg.js';

scheduleJob('0 */5 * * * ?', async () => {
    let playerList = [];
    let files = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let game_action = await redis.get('xiuxian@1.3.0:' + player_id + ':game_action');
        if (+game_action == 0) {
            await redis.set('xiuxian@1.3.0:' + player_id + ':game_action', 1);
            return false;
        }
    }
});
