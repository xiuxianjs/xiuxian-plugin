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
import '../model/XiuxianData.js';
import { Read_najie } from '../model/xiuxian.js';
import { scheduleJob } from 'node-schedule';

const player_path = __PATH.player_path;
scheduleJob('20 0/5 * * * ?', async () => {
    try {
        let playerList = [];
        if (fs.existsSync(player_path)) {
            let files = fs
                .readdirSync(player_path)
                .filter(file => file.endsWith('.json'));
            if (files.length === 0) {
                console.log('无存档可备份');
                return;
            }
            for (let file of files) {
                file = file.replace('.json', '');
                playerList.push(file);
            }
        }
        else {
            console.log(`Directory ${player_path} 不存在`);
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
                console.error(`Error processing player ${usr_qq}:`, err);
                continue;
            }
        }
    }
    catch (err) {
        console.error('Error in scheduled job:', err);
    }
});
