import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import { getConfig } from '../../../../model/Config.js';
import { screenshot } from '../../../../image/index.js';

const regular = /^(#|＃|\/)??(修仙|仙侠)?(帮助|扩展)(\d+)?$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'help');
    if (!Array.isArray(helpData)) {
        return;
    }
    const page = e.MessageText.match(/(\d+)/)?.[1] ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1') : 1;
    const pageSize = 2;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * pageSize, page * pageSize);
    const img = await screenshot('help', `help-${page}`, {
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
