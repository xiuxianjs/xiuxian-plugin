import './api.js';
import { keysAction } from './keys.js';
import { getDataByKey } from './DataControl.js';
import './DataList.js';
import '@alemonjs/db';
import 'alemonjs';
import { shijianc } from './common.js';
import './settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import './currency.js';
import 'crypto';
import 'posthog-node';
import './message.js';

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
async function getLastsignAsso(userId) {
    const time = await getDataByKey(keysAction.lastSignAssoTime(userId));
    if (time !== null) {
        const data = shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { getLastsignAsso, isNotMaintenance, notUndAndNull, sortBy };
