import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getConfig } from '../../../../model/Config.js';
import '@alemonjs/db';
import '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?修仙管理(\d+)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'set');
    const page = e.MessageText.match(/(\d+)/)?.[1]
        ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1')
        : 1;
    const pageSize = 3;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * pageSize, page * pageSize);
    const img = await screenshot('help', `set-${page}`, {
        helpData: data,
        page: page,
        pageSize: pageSize,
        total: total
    }, true);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
