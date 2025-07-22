import { useSend, Image } from 'alemonjs';
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
import { get_ningmenghome_img } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let thing_type = e.MessageText.replace('#柠檬堂', '');
    let img = await get_ningmenghome_img(e, thing_type);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
