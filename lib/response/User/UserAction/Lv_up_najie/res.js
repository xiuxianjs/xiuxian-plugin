import { useSend, Text } from 'alemonjs';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readNajie, readPlayer, Write_najie } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/valuables.scss.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?升级纳戒$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const flag = await Go(e);
    if (!flag)
        return false;
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const najie = await readNajie(usr_qq);
    const player = await readPlayer(usr_qq);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const najie_num = cf.najie_num;
    const najie_price = cf.najie_price;
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
