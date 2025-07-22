import { redis } from '../../api/api.js';
import 'yaml';
import 'fs';
import '../../config/help/Association.yaml.js';
import '../../config/help/help.yaml.js';
import '../../config/help/helpcopy.yaml.js';
import '../../config/help/set.yaml.js';
import '../../config/help/shituhelp.yaml.js';
import '../../config/parameter/namelist.yaml.js';
import '../../config/task/task.yaml.js';
import '../../config/version/version.yaml.js';
import '../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { shijianc } from '../../model/xiuxian.js';
import '../../model/XiuxianData.js';

function isNotMaintenance(ass) {
    let now = new Date();
    let nowTime = now.getTime();
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        return false;
    }
    return true;
}
function isNotNull(obj) {
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

export { getLastsign_Asso, isNotMaintenance, isNotNull, sortBy };
