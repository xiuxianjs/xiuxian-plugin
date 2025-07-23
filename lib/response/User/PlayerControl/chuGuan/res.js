import { redis } from '../../../../api/api.js';
import { selects } from '../../../index.js';
import config from '../../../../model/Config.js';

const regular = /^(#|\/)出关$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (action.shutup == 1)
        return false;
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    const cf = config.getConfig('xiuxian', 'xiuxian');
    cf.biguan.time;
    cf.biguan.cycle;
    if (end_time > now_time) {
        Math.floor((new Date().getTime() - start_time) / 1000 / 60);
    }
    else {
        Math.floor(action.time / 1000 / 60);
    }
    let arr = action;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr));
});
async function getPlayerAction(usr_qq) {
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    return action;
}

export { res as default, regular };
