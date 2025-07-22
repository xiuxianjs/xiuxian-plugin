import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { getPlayerAction } from '../../../../model/xiuxian.js';
import { plant_jiesuan } from '../../api.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)结束采药$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (action.plant == 1) {
        return false;
    }
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    let time;
    let y = 15;
    let x = 48;
    if (end_time > now_time) {
        time = Math.floor((new Date().getTime() - start_time) / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    else {
        time = Math.floor(action.time / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    if (e.name === 'message.create') {
        await plant_jiesuan(e.UserId, time, e.ChannelId, e.Platform);
    }
    else {
        await plant_jiesuan(e.UserId, time, false, e.Platform);
    }
    let arr = action;
    arr.is_jiesuan = 1;
    arr.plant = 1;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr));
});

export { res as default, name, regular, selects };
