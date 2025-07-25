import '../api/api.js';
import '../model/Config.js';
import 'fs';
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
