import { readForum, writeForum } from '../model/trade.js';
import { addCoin } from '../model/economy.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 4 * * ?', async () => {
    let Forum;
    try {
        Forum = await readForum();
    }
    catch {
        await writeForum([]);
        Forum = await readForum();
    }
    const now_time = Date.now();
    for (let i = 0; i < Forum.length; i++) {
        const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000;
        if (time < 3)
            break;
        const usr_qq = Forum[i].qq;
        const lingshi = Forum[i].whole;
        await addCoin(usr_qq, lingshi);
        Forum.splice(i, 1);
        i--;
    }
    await writeForum(Forum);
    return false;
});
