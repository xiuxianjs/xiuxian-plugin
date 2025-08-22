import { readExchange, writeExchange } from '../model/trade.js';
import { addNajieThing } from '../model/najie.js';

const ExchangeTask = async () => {
    console.log('ExchangeTask');
    let Exchange = [];
    try {
        Exchange = await readExchange();
    }
    catch {
        await writeExchange([]);
    }
    const now_time = Date.now();
    if (Exchange.length && 'now_time' in Exchange[0]) {
        const list = Exchange;
        for (let i = 0; i < list.length; i++) {
            const rec = list[i];
            if (!('now_time' in rec))
                break;
            const time = (now_time - rec.now_time) / 24 / 60 / 60 / 1000;
            if (time < 3)
                break;
            const usr_qq = rec.qq;
            const nm = rec.thing;
            const quanity = rec.aconut;
            await addNajieThing(usr_qq, nm.name, nm.class, quanity, Number(nm.pinji));
            list.splice(i, 1);
            i--;
        }
        await writeExchange(list);
    }
    return false;
};

export { ExchangeTask };
