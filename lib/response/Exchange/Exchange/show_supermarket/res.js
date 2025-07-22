import { useSend } from 'alemonjs';
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
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { get_supermarket_img } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)冲水堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let thing_class = e.MessageText.replace('#冲水堂', '');
    let img = await get_supermarket_img(e, thing_class);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
