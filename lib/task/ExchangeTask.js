import 'yaml';
import 'fs';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import 'path';
import '../model/paths.js';
import '../model/XiuxianData.js';
import { Read_Exchange, Write_Exchange, Add_najie_thing } from '../model/xiuxian.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 4 * * ?', async () => {
    let Exchange;
    try {
        Exchange = await Read_Exchange();
    }
    catch {
        await Write_Exchange([]);
        Exchange = await Read_Exchange();
    }
    const now_time = new Date().getTime();
    for (let i = 0; i < Exchange.length; i++) {
        const time = (now_time - Exchange[i].now_time) / 24 / 60 / 60 / 1000;
        if (time < 3)
            break;
        const usr_qq = Exchange[i].qq;
        let thing = Exchange[i].name.name;
        const quanity = Exchange[i].aconut;
        if (Exchange[i].name.class == '装备' || Exchange[i].name.class == '仙宠')
            thing = Exchange[i].name;
        await Add_najie_thing(usr_qq, thing, Exchange[i].name.class, quanity, Exchange[i].name.pinji);
        Exchange.splice(i, 1);
        i--;
    }
    await Write_Exchange(Exchange);
    return false;
});
