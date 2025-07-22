import 'yaml';
import 'fs';
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
import '../model/paths.js';
import '../model/XiuxianData.js';
import { Read_shop, Write_shop } from '../model/xiuxian.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 59 20 * * ?', async () => {
    let shop = await Read_shop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].Grade--;
        if (shop[i].Grade < 1) {
            shop[i].Grade = 1;
        }
    }
    await Write_shop(shop);
});
