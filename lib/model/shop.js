import { safeParse } from './utils/safe.js';
import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';

async function writeShop(shop) {
    const redis = getIoRedis();
    await redis.set(keys.shop('shop'), JSON.stringify(shop));
}
async function readShop() {
    const redis = getIoRedis();
    const shop = await redis.get(keys.shop('shop'));
    if (!shop)
        return [];
    return safeParse(shop, []);
}
async function existshop(didian) {
    const shop = await readShop();
    const slot = shop.find(s => s.name == didian);
    if (!slot)
        return false;
    const available = slot.one.filter(t => t.数量 > 0);
    return available.length > 0 ? available : false;
}
var shop = { writeShop, readShop, existshop };

export { shop as default, existshop, readShop, writeShop };
