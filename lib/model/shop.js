import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function writeShop(shop) {
    await setDataJSONStringifyByKey(keys.shop('shop'), shop);
}
async function readShop() {
    const shop = await getDataJSONParseByKey(keys.shop('shop'));
    if (!shop) {
        return [];
    }
    return shop;
}
async function existshop(didian) {
    const shop = await readShop();
    const slot = shop.find(s => s.name == didian);
    if (!slot) {
        return false;
    }
    const available = slot.one.filter(t => t.数量 > 0);
    return available.length > 0 ? available : false;
}
var shop = { writeShop, readShop, existshop };

export { shop as default, existshop, readShop, writeShop };
