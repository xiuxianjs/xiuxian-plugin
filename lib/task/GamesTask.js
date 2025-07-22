import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import { redis } from '../api/api.js';

scheduleJob('0 */5 * * * ?', async () => {
    let playerList = [];
    let files = fs
        .readdirSync('./resources/data/xiuxian_player')
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
