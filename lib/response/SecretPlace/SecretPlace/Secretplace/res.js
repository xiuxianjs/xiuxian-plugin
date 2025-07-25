import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Goweizhi } from '../../../../model/xiuxian.js';
import 'dayjs';
import '../../../../api/api.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?秘境$/;
var res = onResponse(selects, async (e) => {
    let weizhi = data.didian_list;
    await Goweizhi(e, weizhi);
});

export { res as default, regular };
