import { useSend, Text, Image } from 'alemonjs';
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
import { existplayer } from '../../../../model/xiuxian.js';
import { Read_tiandibang, Write_tiandibang, get_tianditang_img } from '../tian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)天地堂/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang;
    try {
        tiandibang = await Read_tiandibang();
    }
    catch {
        await Write_tiandibang([]);
        tiandibang = await Read_tiandibang();
    }
    let m = tiandibang.length;
    for (m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq == usr_qq) {
            break;
        }
    }
    if (m == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    let img = await get_tianditang_img(e, tiandibang[m].积分);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
