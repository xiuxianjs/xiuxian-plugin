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
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import { readDanyao, writeDanyao } from '../../../../model/danyao.js';
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
import { readActionWithSuffix, isActionRunning, formatRemaining, remainingMs, startActionWithSuffix } from '../../../actionHelper.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?开始炼制/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text(`请先去#炼器师能力评测,再来锻造吧`));
        return false;
    }
    let newtripod = [];
    try {
        newtripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (const item of newtripod) {
        if (user_qq == item.qq) {
            if (item.材料.length == 0) {
                Send(Text(`炉子为空,无法炼制`));
                return false;
            }
            const action = await readActionWithSuffix(user_qq, 'action10');
            if (isActionRunning(action)) {
                Send(Text(`正在${action.action}中，剩余时间:${formatRemaining(remainingMs(action))}`));
                return false;
            }
            item.状态 = 1;
            item.TIME = Date.now();
            await writeDuanlu(newtripod);
            const action_time = 180 * 60 * 1000;
            const arr = await startActionWithSuffix(user_qq, 'action10', '锻造', action_time, {});
            const rawDy = await readDanyao(user_qq);
            let needWrite = false;
            let xingyunAfter = -1;
            for (const it of rawDy) {
                const ref = it;
                if (typeof ref.xingyun === 'number' && ref.xingyun >= 1) {
                    ref.xingyun--;
                    xingyunAfter = ref.xingyun;
                    needWrite = true;
                }
            }
            if (xingyunAfter === 0) {
                for (const it of rawDy) {
                    const ref = it;
                    if (typeof ref.beiyong5 === 'number' && ref.beiyong5 > 0) {
                        ref.beiyong5 = 0;
                        needWrite = true;
                    }
                }
            }
            if (needWrite)
                await writeDanyao(user_qq, rawDy);
            await setValue(userKey(user_qq, 'action10'), arr);
            Send(Text(`现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间`));
            return false;
        }
    }
});

export { res as default, regular };
