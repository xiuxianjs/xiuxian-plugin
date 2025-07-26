import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { redis } from '../api/api.js';
import '../model/Config.js';
import 'path';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'lodash-es';
import { setDataByUserId } from '../model/Redis.js';
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
            await setDataByUserId(player_id, 'game_action', 1);
            return false;
        }
    }
});
