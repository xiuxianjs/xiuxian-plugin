import '../model/api.js';
import { readShop, writeShop } from '../model/shop.js';
import { scheduleJob } from 'node-schedule';
import data from '../model/XiuxianData.js';

scheduleJob('0 0 21 ? * 1,5', async () => {
    const shop = await readShop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].one = data.shop_list[i].one;
        shop[i].price = data.shop_list[i].price;
    }
    await writeShop(shop);
});
