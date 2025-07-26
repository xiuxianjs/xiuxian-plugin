import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { getPlayerAction } from '../../../../model/xiuxian.js';
import 'dayjs';
import { mine_jiesuan } from '../../api.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?结束采矿$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (action.action == '空闲')
        return;
    if (action.mine == 1)
        return false;
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    let time;
    let y = 30;
    let x = 24;
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
        await mine_jiesuan(e.UserId, time, e.Platform, e.ChannelId);
    }
    else {
        await mine_jiesuan(e.UserId, time, e.Platform);
    }
    let arr = action;
    arr.is_jiesuan = 1;
    arr.mine = 1;
    arr.plant = 1;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr));
});

export { res as default, regular };
