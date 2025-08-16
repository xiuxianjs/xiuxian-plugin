import '../model/api.js';
import { readShop, writeShop } from '../model/shop.js';
import data from '../model/XiuxianData.js';

const Shoptask = async () => {
    const shop = await readShop();
    for (let i = 0; i < shop.length; i++) {
        shop[i].one = data.shop_list[i].one;
        shop[i].price = data.shop_list[i].price;
    }
    await writeShop(shop);
};

export { Shoptask };
