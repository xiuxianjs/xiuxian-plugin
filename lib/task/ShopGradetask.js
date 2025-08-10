import '../model/Config.js';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import '../model/XiuxianData.js';
import '@alemonjs/db';
import { readShop, writeShop } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 59 20 * * ?', async () => {
    let shop = await readShop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].Grade--;
        if (shop[i].Grade < 1) {
            shop[i].Grade = 1;
        }
    }
    await writeShop(shop);
});
