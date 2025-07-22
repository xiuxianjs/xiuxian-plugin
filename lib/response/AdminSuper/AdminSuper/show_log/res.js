import { useSend, Image } from 'alemonjs';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import Game from '../../../../model/show.js';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Read_updata_log } from '../../../../model/xiuxian.js';
import '../../../../api/api.js';
import puppeteer from '../../../../image/index.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)查看日志$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        let j;
        const reader = await Read_updata_log();
        let str = [];
        let line_log = reader.trim().split('\n');
        line_log.forEach((item, index) => {
            if (!item) {
                line_log.splice(index, 1);
            }
        });
        for (let y = 0; y < line_log.length; y++) {
            let temp = line_log[y].trim().split(/\s+/);
            let i = 0;
            if (temp.length == 4) {
                str.push(temp[0]);
                i = 1;
            }
            let t = '';
            for (let x = i; x < temp.length; x++) {
                t += temp[x];
                if (x == temp.length - 2 || x == temp.length - 3) {
                    t += '\t';
                }
            }
            str.push(t);
        }
        let T;
        for (j = 0; j < str.length / 2; j++) {
            T = str[j];
            str[j] = str[str.length - 1 - j];
            str[str.length - 1 - j] = T;
        }
        for (j = str.length - 1; j > -1; j--) {
            if (str[j] == '零' || str[j] == '打铁的') {
                let m = j;
                while (str[m - 1] != '零' && str[m - 1] != '打铁的' && m > 0) {
                    T = str[m];
                    str[m] = str[m - 1];
                    str[m - 1] = T;
                    m--;
                }
            }
        }
        let log_data = { log: str };
        const data1 = await new Game().get_logData(log_data);
        let img = await puppeteer.screenshot('log', e.UserId, { ...data1 });
        if (img)
            Send(Image(img));
        return false;
    }
});

export { res as default, regular, selects };
