import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'alemonjs';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'crypto';

const regular = /^(#|＃|\/)?仙境$/;
var res = onResponse(selects, async (e) => {
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const list = (data.Fairyrealm_list || []);
    if (!Array.isArray(list) || list.length === 0)
        return false;
    await Goweizhi(e, list);
    return false;
});

export { res as default, regular };
