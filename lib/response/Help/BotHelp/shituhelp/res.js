import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { screenshot } from '../../../../image/index.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/api.js';
import { getConfig } from '../../../../model/Config.js';
import 'dayjs';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?师徒帮助(\d+)?$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'shituhelp');
    const page = e.MessageText.match(/(\d+)/)?.[1] ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1') : 1;
    const pageSize = 2;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * pageSize, page * pageSize);
    const img = await screenshot('help', `shituhelp-${page}`, {
        helpData: data,
        page: page,
        pageSize: pageSize,
        total: total
    }, true);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
