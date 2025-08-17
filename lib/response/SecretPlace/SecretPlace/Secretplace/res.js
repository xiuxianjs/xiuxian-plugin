import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import { selects } from '../../../index.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'alemonjs';
import data from '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?秘境$/;
var res = onResponse(selects, async (e) => {
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const weizhi = (data.didian_list || []);
    if (!Array.isArray(weizhi) || weizhi.length === 0)
        return false;
    const pubEvent = e;
    await Goweizhi(pubEvent, weizhi);
    return false;
});

export { res as default, regular };
