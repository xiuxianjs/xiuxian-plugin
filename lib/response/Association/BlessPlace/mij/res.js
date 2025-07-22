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
import '../../../../api/api.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)宗门秘境$/;
var res = onResponse(selects, async (e) => {
    let addres = '宗门秘境';
    let weizhi = data.guildSecrets_list;
    Goweizhi(e, weizhi, addres);
});

export { res as default, regular, selects };
