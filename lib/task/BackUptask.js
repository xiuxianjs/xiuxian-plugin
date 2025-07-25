import '../model/Config.js';
import fs from 'fs';
import 'path';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import { Read_najie } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

scheduleJob('20 0/5 * * * ?', async () => {
    const player_path = __PATH.player_path;
    try {
        let playerList = [];
        if (fs.existsSync(player_path)) {
            let files = fs
                .readdirSync(player_path)
                .filter(file => file.endsWith('.json'));
            if (files.length === 0) {
                logger.info('无存档可备份');
                return;
            }
            for (let file of files) {
                file = file.replace('.json', '');
                playerList.push(file);
            }
        }
        else {
            logger.info(`Directory ${player_path} 不存在`);
            return;
        }
        if (!fs.existsSync(`${__PATH.auto_backup}/najie`)) {
            fs.mkdirSync(`${__PATH.auto_backup}/najie`, { recursive: true });
        }
        for (let player_id of playerList) {
            let usr_qq = player_id;
            try {
                await Read_najie(usr_qq);
                fs.copyFileSync(`${__PATH.najie_path}/${usr_qq}.json`, `${__PATH.auto_backup}/najie/${usr_qq}.json`);
            }
            catch (err) {
                logger.error(`Error processing player ${usr_qq}:`, err);
                continue;
            }
        }
    }
    catch (err) {
        logger.error('Error in scheduled job:', err);
    }
});
