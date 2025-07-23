import '../api/api.js';
import 'yaml';
import 'fs';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import 'path';
import '../model/paths.js';
import data from '../model/XiuxianData.js';
import { Read_shop, Write_shop } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 21 ? * 1,5', async () => {
    let shop = await Read_shop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].one = data.shop_list[i].one;
        shop[i].price = data.shop_list[i].price;
    }
    await Write_shop(shop);
});
