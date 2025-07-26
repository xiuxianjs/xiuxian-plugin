import { scheduleJob } from 'node-schedule';
import { redis } from '../api/api.js';
import '../model/Config.js';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'lodash-es';
import { setDataByUserId } from '../model/Redis.js';
import 'dayjs';

scheduleJob('0 */5 * * * ?', async () => {
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let player_id of playerList) {
        let game_action = await redis.get('xiuxian@1.3.0:' + player_id + ':game_action');
        if (+game_action == 1) {
            await setDataByUserId(player_id, 'game_action', 0);
            return false;
        }
    }
});
