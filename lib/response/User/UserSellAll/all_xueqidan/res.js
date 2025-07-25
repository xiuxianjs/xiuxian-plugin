import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing, Add_血气 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键服用血气丹$/;
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

export { res as default, regular };
