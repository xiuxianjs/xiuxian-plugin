import '../model/Config.js';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import '../model/XiuxianData.js';
import '../api/api.js';
import { readForum, writeForum, addCoin } from '../model/xiuxian.js';
import 'dayjs';
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
    const now_time = new Date().getTime();
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
