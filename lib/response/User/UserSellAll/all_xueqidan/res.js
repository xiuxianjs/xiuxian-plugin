import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import { existplayer, exist_najie_thing, Add_najie_thing, Add_血气 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';

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

export { res as default, regular, selects };
