import { readShop, writeShop } from '../model/shop.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 59 20 * * ?', async () => {
    const shop = (await readShop());
    for (const slot of shop) {
        const current = Number(slot.Grade || 1);
        slot.Grade = current - 1;
        if (slot.Grade < 1)
            slot.Grade = 1;
    }
    await writeShop(shop);
});
