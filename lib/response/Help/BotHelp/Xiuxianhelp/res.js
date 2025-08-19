import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getConfig } from '../../../../model/Config.js';
import { screenshot } from '../../../../image/index.js';

const regular = /^(#|＃|\/)??(修仙|仙侠)?帮助(\d+)?$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'help');
    const n = e.MessageText?.match(/(\d+)/)?.[1];
    const page = !n ? 1 : parseInt(n) > helpData.length ? 1 : parseInt(n);
    const pageSize = 3;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * 3, page * 3);
    const img = await screenshot('help', `help-${page}`, {
        helpData: data,
        page: page,
        pageSize: pageSize,
        total: total
    }, true);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
