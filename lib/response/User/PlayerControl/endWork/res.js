import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { getPlayerAction } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)降妖归来$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (action.working == 1)
        return false;
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    const cf = config.getConfig('xiuxian', 'xiuxian');
    cf.work.time;
    cf.work.cycle;
    if (end_time > now_time) {
        Math.floor((new Date().getTime() - start_time) / 1000 / 60);
    }
    else {
        Math.floor(action.time / 1000 / 60);
    }
    let arr = action;
    arr.is_jiesuan = 1;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr));
});

export { res as default, name, regular, selects };
