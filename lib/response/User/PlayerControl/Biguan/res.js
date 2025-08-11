import { useSend, Text } from 'alemonjs';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { setDataByUserId } from '../../../../model/Redis.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { readAction, isActionRunning, startAction, normalizeBiguanMinutes } from '../../../actionHelper.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const game_action = await getString(userKey(usr_qq, 'game_action'));
    if (game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
        .replace('闭关', '')
        .replace(/[分分钟钟]/g, '')
        .trim();
    const parsed = parseInt(timeStr, 10);
    const time = normalizeBiguanMinutes(Number.isNaN(parsed) ? undefined : parsed);
    const action = await readAction(usr_qq);
    if (isActionRunning(action)) {
        const now = Date.now();
        const rest = action.end_time - now;
        const m = Math.floor(rest / 60000);
        const s = Math.floor((rest - m * 60000) / 1000);
        Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));
        return false;
    }
    const action_time = time * 60 * 1000;
    await startAction(usr_qq, '闭关', action_time, {
        plant: '1',
        shutup: '0',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1'
    });
    const mirror = await readAction(usr_qq);
    if (mirror)
        await setDataByUserId(usr_qq, 'action', JSON.stringify(mirror));
    Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`));
});

export { res as default, regular };
