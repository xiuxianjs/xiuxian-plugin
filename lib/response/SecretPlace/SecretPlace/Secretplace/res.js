import { Goweizhi } from '../../../../model/image.js';
import mw, { selects } from '../../../mw.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'alemonjs';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?秘境$/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const didian = await getDataList('Didian');
    if (!Array.isArray(didian) || didian.length === 0) {
        return false;
    }
    await Goweizhi(e, didian);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
