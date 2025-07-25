import '../model/Config.js';
import 'fs';
import 'path';
import '../model/paths.js';
import '../model/XiuxianData.js';
import { Read_Forum, Write_Forum, Add_灵石 as Add___ } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 4 * * ?', async () => {
    let Forum;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    const now_time = new Date().getTime();
    for (let i = 0; i < Forum.length; i++) {
        const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000;
        if (time < 3)
            break;
        const usr_qq = Forum[i].qq;
        const lingshi = Forum[i].whole;
        await Add___(usr_qq, lingshi);
        Forum.splice(i, 1);
        i--;
    }
    await Write_Forum(Forum);
    return false;
});
