import { redis } from '../../api/api.js';
import '../../model/Config.js';
import '../../config/Association.yaml.js';
import '../../config/help.yaml.js';
import '../../config/help2.yaml.js';
import '../../config/set.yaml.js';
import '../../config/shituhelp.yaml.js';
import '../../config/namelist.yaml.js';
import '../../config/task.yaml.js';
import '../../config/version.yaml.js';
import '../../config/xiuxian.yaml.js';
import '../../model/XiuxianData.js';
import '@alemonjs/db';
import { shijianc } from '../../model/xiuxian.js';
import 'dayjs';

function isNotMaintenance(ass) {
    let now = new Date();
    let nowTime = now.getTime();
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        return false;
    }
    return true;
}
function notUndAndNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}
function sortBy(field) {
    return function (b, a) {
        return a[field] - b[field];
    };
}
async function getLastsign_Asso(usr_qq) {
    let time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastsign_Asso_time');
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { getLastsign_Asso, isNotMaintenance, notUndAndNull, sortBy };
