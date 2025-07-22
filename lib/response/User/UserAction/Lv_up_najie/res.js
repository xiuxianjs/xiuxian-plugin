import { useSend, Text } from 'alemonjs';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Go, existplayer, Read_najie, Read_player, Add_灵石 as Add___, Write_najie } from '../../../../model/xiuxian.js';
import '../../../../api/api.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)升级纳戒$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let flag = await Go(e);
    if (!flag)
        return false;
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await Read_najie(usr_qq);
    let player = await Read_player(usr_qq);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let najie_num = cf.najie_num;
    let najie_price = cf.najie_price;
    if (najie.等级 == najie_num.length) {
        Send(Text('你的纳戒已经是最高级的了'));
        return false;
    }
    if (player.灵石 < najie_price[najie.等级]) {
        Send(Text(`灵石不足,还需要准备${najie_price[najie.等级] - player.灵石}灵石`));
        return false;
    }
    await Add___(usr_qq, -najie_price[najie.等级]);
    najie.灵石上限 = najie_num[najie.等级];
    najie.等级 += 1;
    await Write_najie(usr_qq, najie);
    Send(Text(`你的纳戒升级成功,花了${najie_price[najie.等级 - 1]}灵石,目前纳戒灵石存储上限为${najie.灵石上限},可以使用【#我的纳戒】来查看`));
});

export { res as default, regular, selects };
