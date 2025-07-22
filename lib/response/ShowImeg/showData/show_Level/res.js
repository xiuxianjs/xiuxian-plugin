import { useSend, Image } from 'alemonjs';
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
import '../../../../model/XiuxianData.js';
import { get_state_img } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)练气境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_state_img(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, regular, selects };
