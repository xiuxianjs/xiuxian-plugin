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
import '@alemonjs/db';
import { existplayer, existNajieThing, addNajieThing, addExp } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键服用修为丹$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await await data.getData('najie', usr_qq);
    let xiuwei = 0;
    for (let l of najie.丹药) {
        if (l.type == '修为') {
            let quantity = await existNajieThing(usr_qq, l.name, l.class);
            await addNajieThing(usr_qq, l.name, l.class, -quantity);
            xiuwei = xiuwei + l.exp * quantity;
        }
    }
    await addExp(usr_qq, xiuwei);
    Send(Text(`服用成功,修为增加${xiuwei}`));
});

export { res as default, regular };
