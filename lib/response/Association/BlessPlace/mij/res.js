import { createEventName } from '../../../util.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { Goweizhi } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';
import '../../../../api/api.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)宗门秘境$/;
var res = onResponse(selects, async (e) => {
    let addres = '宗门秘境';
    let weizhi = data.guildSecrets_list;
    Goweizhi(e, weizhi, addres);
});

export { res as default, name, regular, selects };
