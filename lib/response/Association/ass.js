import { redis } from '../../model/api.js';
import { getRedisKey } from '../../model/keys.js';
import '@alemonjs/db';
import 'alemonjs';
import { shijianc } from '../../model/common.js';
import '../../model/DataList.js';
import 'lodash-es';
import '../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../model/currency.js';
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
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import '../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';

function isNotMaintenance(ass) {
    const now = new Date();
    const nowTime = now.getTime();
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        return false;
    }
    return true;
}
function notUndAndNull(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }
    return true;
}
function sortBy(field) {
    return function (b, a) {
        return a[field] - b[field];
    };
}
async function getLastsign_Asso(userId) {
    const time = await redis.get(getRedisKey(userId, 'lastsign_Asso_time'));
    if (time !== null) {
        const data = shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { getLastsign_Asso, isNotMaintenance, notUndAndNull, sortBy };
