import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getConfig } from '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/settions.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?修仙扩展(\d+)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const helpData = await getConfig('help', 'help2');
    const page = e.MessageText.match(/(\d+)/)?.[1]
        ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1')
        : 1;
    const pageSize = 3;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * 3, page * 3);
    const img = await screenshot('help', `help2-${page}`, {
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
