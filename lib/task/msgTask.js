import { pushInfo } from '../api/api.js';
import 'yaml';
import 'fs';
import '../config/help/Association.yaml.js';
import '../config/help/help.yaml.js';
import '../config/help/helpcopy.yaml.js';
import '../config/help/set.yaml.js';
import '../config/help/shituhelp.yaml.js';
import '../config/parameter/namelist.yaml.js';
import '../config/task/task.yaml.js';
import '../config/version/version.yaml.js';
import '../config/xiuxian/xiuxian.yaml.js';
import Game from '../model/show.js';
import 'path';
import { Read_temp, Write_temp } from '../model/xiuxian.js';
import '../model/XiuxianData.js';
import { scheduleJob } from 'node-schedule';
import puppeteer from '../image/index.js';

scheduleJob('20 0/5 * * * ?', async () => {
    let temp;
    try {
        temp = await Read_temp();
    }
    catch {
        await Write_temp([]);
        temp = await Read_temp();
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
            const data1 = await new Game({}).get_tempData(temp_data);
            let img = await puppeteer.screenshot('temp', i.qq, {
                ...data1
            });
            const [platform, group_id] = i.split(':');
            if (img)
                await pushInfo(platform, group_id, true, img);
        }
        await Write_temp([]);
    }
});
