import '../model/Config.js';
import 'fs';
import 'path';
import '../model/paths.js';
import '../model/XiuxianData.js';
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
