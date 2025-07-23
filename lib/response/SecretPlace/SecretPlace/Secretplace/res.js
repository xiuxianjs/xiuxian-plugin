import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Goweizhi } from '../../../../model/xiuxian.js';
import 'dayjs';
import '../../../../api/api.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?秘境$/;
var res = onResponse(selects, async (e) => {
    let addres = '秘境';
    let weizhi = data.didian_list;
    await Goweizhi(e, weizhi, addres);
});

export { res as default, regular };
