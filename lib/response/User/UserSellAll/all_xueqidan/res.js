import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing, Add_血气 as Add___ } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)一键服用血气丹$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await data.getData('najie', usr_qq);
    let xueqi = 0;
    for (let l of najie.丹药) {
        if (l.type == '血气') {
            let quantity = await exist_najie_thing(usr_qq, l.name, l.class);
            await Add_najie_thing(usr_qq, l.name, l.class, -quantity);
            xueqi = xueqi + l.xueqi * quantity;
        }
    }
    await Add___(usr_qq, xueqi);
    Send(Text(`服用成功,血气增加${xueqi}`));
});

export { res as default, name, regular, selects };
