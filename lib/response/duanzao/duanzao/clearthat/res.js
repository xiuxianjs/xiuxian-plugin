import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { looktripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/XiuxianData.js';
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
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { setValue, userKey } from '../../../../model/utils/redisHelper.js';
import { stopActionWithSuffix } from '../../../actionHelper.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A == 1) {
        const newtripod = await readTripod();
        for (const item of newtripod) {
            if (user_qq == item.qq) {
                item.材料 = [];
                item.数量 = [];
                item.TIME = 0;
                item.时长 = 30000;
                item.状态 = 0;
                item.预计时长 = 0;
                await writeDuanlu(newtripod);
                await stopActionWithSuffix(user_qq, 'action10');
                await setValue(userKey(user_qq, 'action10'), null);
                Send(Text('材料成功清除'));
                return false;
            }
        }
    }
});

export { res as default, regular };
