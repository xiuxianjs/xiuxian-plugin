import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, existNajieThing, addNajieThing, addExp2 } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键服用血气丹$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await await data.getData('najie', usr_qq);
    let xueqi = 0;
    for (let l of najie.丹药) {
        if (l.type == '血气') {
            let quantity = await existNajieThing(usr_qq, l.name, l.class);
            await addNajieThing(usr_qq, l.name, l.class, -quantity);
            xueqi = xueqi + l.xueqi * quantity;
        }
    }
    await addExp2(usr_qq, xueqi);
    Send(Text(`服用成功,血气增加${xueqi}`));
});

export { res as default, regular };
