import { redis } from '../../model/api.js';
import '../../model/Config.js';
import '../../config/Association.yaml.js';
import '../../config/help.yaml.js';
import '../../config/help2.yaml.js';
import '../../config/set.yaml.js';
import '../../config/shituhelp.yaml.js';
import '../../config/task.yaml.js';
import '../../config/xiuxian.yaml.js';
import '../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../model/xiuxian_impl.js';
import '../../model/danyao.js';
import { shijianc } from '../../model/common.js';
import 'lodash-es';
import '../../model/equipment.js';
import '../../model/shop.js';
import '../../model/trade.js';
import '../../model/qinmidu.js';
import '../../model/shitu.js';
import '../../model/temp.js';
import 'alemonjs';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/styles/player.scss.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';

function isNotMaintenance(ass) {
    const now = new Date();
    const nowTime = now.getTime();
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
    const time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastsign_Asso_time');
    if (time != null) {
        const data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { getLastsign_Asso, isNotMaintenance, notUndAndNull, sortBy };
