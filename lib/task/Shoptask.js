import { getDataList } from '../model/DataList.js';
import { readShop, writeShop } from '../model/shop.js';

const Shoptask = async () => {
    const shop = await readShop();
    const shopList = await getDataList('Shop');
    for (let i = 0; i < shop.length; i++) {
        shop[i].one = shopList[i].one;
        shop[i].price = shopList[i].price;
    }
    await writeShop(shop);
};

export { Shoptask };
