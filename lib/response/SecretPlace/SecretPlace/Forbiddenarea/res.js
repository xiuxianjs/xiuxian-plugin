import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { jindi } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?禁地$/;
var res = onResponse(selects, async (e) => {
    let addres = '禁地';
    let weizhi = data.forbiddenarea_list;
    await jindi(e, weizhi, addres);
});

export { res as default, regular };
