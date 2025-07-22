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
import { Read_najie, __PATH } from '../model/xiuxian.js';
import '../model/XiuxianData.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('20 0/5 * * * ?', async () => {
    let playerList = [];
    let files = fs
        .readdirSync('./resources/data/xiuxian_player')
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let usr_qq = player_id;
        try {
            await Read_najie(usr_qq);
            fs.copyFileSync(`${__PATH.najie_path}/${usr_qq}.json`, `${__PATH.auto_backup}/najie/${usr_qq}.json`);
        }
        catch {
            continue;
        }
    }
});
