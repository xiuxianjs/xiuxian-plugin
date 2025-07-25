import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { synchronization, Synchronization_ASS } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键同步$/;
var res = onResponse(selects, async (e) => {
    await synchronization(e);
    await Synchronization_ASS(e);
    return false;
});

export { res as default, regular };
