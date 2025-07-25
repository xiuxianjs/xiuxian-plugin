import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { redis } from '../api/api.js';
import '../model/Config.js';
import 'path';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'jsxp';
import 'react';
import '../resources/html/adminset/adminset.css.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/state.jpg.js';
import '../resources/img/user_state.png.js';
import '../resources/html/association/association.css.js';
import '../resources/img/player.jpg.js';
import '../resources/html/danfang/danfang.css.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/html/gongfa/gongfa.css.js';
import '../resources/html/equipment/equipment.css.js';
import '../resources/img/equipment.jpg.js';
import '../resources/html/fairyrealm/fairyrealm.css.js';
import '../resources/img/card.jpg.js';
import '../resources/html/forbidden_area/forbidden_area.css.js';
import '../resources/img/road.jpg.js';
import '../resources/html/supermarket/supermarket.css.js';
import '../resources/html/Ranking/tailwindcss.css.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help/help.js';
import '../resources/html/log/log.css.js';
import '../resources/img/najie.jpg.js';
import '../resources/html/ningmenghome/ningmenghome.css.js';
import '../resources/html/najie/najie.css.js';
import '../resources/html/player/player.css.js';
import '../resources/html/playercopy/player.css.js';
import '../resources/html/secret_place/secret_place.css.js';
import '../resources/html/shenbing/shenbing.css.js';
import '../resources/html/shifu/shifu.css.js';
import '../resources/html/shitu/shitu.css.js';
import '../resources/html/shituhelp/common.css.js';
import '../resources/html/shituhelp/shituhelp.css.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/html/shop/shop.css.js';
import '../resources/html/statezhiye/statezhiye.css.js';
import '../resources/html/sudoku/sudoku.css.js';
import '../resources/html/talent/talent.css.js';
import '../resources/html/temp/temp.css.js';
import '../resources/html/time_place/time_place.css.js';
import '../resources/html/tujian/tujian.css.js';
import '../resources/html/tuzhi/tuzhi.css.js';
import '../resources/html/valuables/valuables.css.js';
import '../resources/img/valuables-top.jpg.js';
import '../resources/img/valuables-danyao.jpg.js';
import '../resources/html/updateRecord/updateRecord.css.js';
import 'lodash-es';
import '@alemonjs/db';
import 'dayjs';

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
