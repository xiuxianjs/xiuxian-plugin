import { __PATH } from './paths.js';
import { safeParse } from './utils/safe.js';
import { getIoRedis } from '@alemonjs/db';

const redis = getIoRedis();
async function writeShop(shop) {
    await redis.set(`${__PATH.shop}:shop`, JSON.stringify(shop));
}
async function readShop() {
    const shop = await redis.get(`${__PATH.shop}:shop`);
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
