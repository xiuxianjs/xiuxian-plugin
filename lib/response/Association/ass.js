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
import { shijianc } from '../../model/common.js';
import 'lodash-es';
import '../../model/equipment.js';
import '../../model/shop.js';
import '../../model/trade.js';
import '../../model/qinmidu.js';
import '../../model/shitu.js';
import '../../model/danyao.js';
import '../../model/temp.js';
import 'alemonjs';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../resources/html/adminset/adminset.css.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/state.jpg.js';
import '../../resources/img/user_state.png.js';
import '../../resources/html/association/association.css.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/html/danfang/danfang.css.js';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/html/gongfa/gongfa.css.js';
import '../../resources/html/equipment/equipment.css.js';
import '../../resources/img/equipment.jpg.js';
import '../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../resources/img/card.jpg.js';
import '../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../resources/img/road.jpg.js';
import '../../resources/html/supermarket/supermarket.css.js';
import '../../resources/html/Ranking/tailwindcss.css.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help/help.js';
import '../../resources/html/log/log.css.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../resources/html/najie/najie.css.js';
import '../../resources/html/player/player.css.js';
import '../../resources/html/playercopy/player.css.js';
import '../../resources/html/secret_place/secret_place.css.js';
import '../../resources/html/shenbing/shenbing.css.js';
import '../../resources/html/shifu/shifu.css.js';
import '../../resources/html/shitu/shitu.css.js';
import '../../resources/html/shituhelp/common.css.js';
import '../../resources/html/shituhelp/shituhelp.css.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/html/shop/shop.css.js';
import '../../resources/html/statezhiye/statezhiye.css.js';
import '../../resources/html/sudoku/sudoku.css.js';
import '../../resources/html/talent/talent.css.js';
import '../../resources/html/temp/temp.css.js';
import '../../resources/html/time_place/time_place.css.js';
import '../../resources/html/tujian/tujian.css.js';
import '../../resources/html/tuzhi/tuzhi.css.js';
import '../../resources/html/valuables/valuables.css.js';
import '../../resources/img/valuables-top.jpg.js';
import '../../resources/img/valuables-danyao.jpg.js';
import '../../resources/html/updateRecord/updateRecord.css.js';
import '../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../resources/html/jindi/BlessPlace.css.js';
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
