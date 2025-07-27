import { useSend, Text } from 'alemonjs';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { Go, existplayer, readNajie, readPlayer, addCoin, Write_najie } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?升级纳戒$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let flag = await Go(e);
    if (!flag)
        return false;
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await readNajie(usr_qq);
    let player = await readPlayer(usr_qq);
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
    await addCoin(usr_qq, -najie_price[najie.等级]);
    najie.灵石上限 = najie_num[najie.等级];
    najie.等级 += 1;
    await Write_najie(usr_qq, najie);
    Send(Text(`你的纳戒升级成功,花了${najie_price[najie.等级 - 1]}灵石,目前纳戒灵石存储上限为${najie.灵石上限},可以使用【#我的纳戒】来查看`));
});

export { res as default, regular };
