import { readShop, writeShop } from '../model/shop.js';

const ShopGradetask = async () => {
    const shop = await readShop();
    for (const slot of shop) {
        const current = Number(slot.Grade ?? 1);
        slot.Grade = current - 1;
        if (slot.Grade < 1) {
            slot.Grade = 1;
        }
    }
    await writeShop(shop);
};

export { ShopGradetask };
