import { useSend, Text } from 'alemonjs';
import { getString, userKey } from '../../../../model/utils/redisHelper.js';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { setDataByUserId } from '../../../../model/Redis.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
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
