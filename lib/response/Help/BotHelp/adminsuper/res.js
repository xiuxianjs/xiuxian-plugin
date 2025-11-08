import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import { getConfig } from '../../../../model/Config.js';
import 'dayjs';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?修仙管理(\d+)?$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'set');
    if (!Array.isArray(helpData)) {
        return;
    }
    const page = e.MessageText.match(/(\d+)/)?.[1] ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1') : 1;
    const pageSize = 2;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * pageSize, page * pageSize);
    const img = await screenshot('help', `set-${page}`, {
        helpData: data,
        page: page,
        pageSize: pageSize,
        total: total
    }, true);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
