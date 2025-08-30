import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { Go } from '../../../../model/common.js';
import { existplayer, readNajie, readPlayer, writeNajie } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?升级纳戒$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const najie = await readNajie(userId);
    const player = await readPlayer(userId);
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const najie_num = cf.najie_num;
    const najie_price = cf.najie_price;
    if (najie.等级 === najie_num.length) {
        void Send(Text('你的纳戒已经是最高级的了'));
        return false;
    }
    if (player.灵石 < najie_price[najie.等级]) {
        void Send(Text(`灵石不足,还需要准备${najie_price[najie.等级] - player.灵石}灵石`));
        return false;
    }
    await addCoin(userId, -najie_price[najie.等级]);
    najie.灵石上限 = najie_num[najie.等级];
    najie.等级 += 1;
    await writeNajie(userId, najie);
    void Send(Text(`你的纳戒升级成功,花了${najie_price[najie.等级 - 1]}灵石,目前纳戒灵石存储上限为${najie.灵石上限},可以使用【#我的纳戒】来查看`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
