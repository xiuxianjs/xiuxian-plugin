import '../api/api.js';
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
import data from '../model/XiuxianData.js';
import { Read_shop, Write_shop } from '../model/xiuxian.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 21 ? * 1,5', async () => {
    let shop = await Read_shop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].one = data.shop_list[i].one;
        shop[i].price = data.shop_list[i].price;
    }
    await Write_shop(shop);
});
