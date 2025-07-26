import { pushInfo } from '../api/api.js';
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
import { readTemp, writeTemp } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';
import puppeteer from '../image/index.js';

scheduleJob('20 0/5 * * * ?', async () => {
    let temp = [];
    try {
        temp = await readTemp();
    }
    catch {
        await writeTemp([]);
    }
    if (temp.length > 0) {
        let group = [];
        group.push(temp[0].qq_group);
        f1: for (let i of temp) {
            for (let j of group) {
                if (i.qq_group == j)
                    continue f1;
            }
            group.push(i.qq_group);
        }
        for (let i of group) {
            let msg = [];
            for (let j of temp) {
                if (i == j.qq_group) {
                    msg.push(j.msg);
                }
            }
            let temp_data = {
                temp: msg
            };
            let img = await puppeteer.screenshot('temp', i.qq, temp_data);
            const [platform, group_id] = i.split(':');
            if (img)
                await pushInfo(platform, group_id, true, img);
        }
        await writeTemp([]);
    }
});
