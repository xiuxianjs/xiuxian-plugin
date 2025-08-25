import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import mw, { selects } from '../../../mw.js';
import '@alemonjs/db';
import 'alemonjs';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import 'crypto';
import '../../../../route/core/auth.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?仙境$/;
const res = onResponse(selects, async (e) => {
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const list = (data.Fairyrealm_list || []);
    if (!Array.isArray(list) || list.length === 0)
        return false;
    await Goweizhi(e, list);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
