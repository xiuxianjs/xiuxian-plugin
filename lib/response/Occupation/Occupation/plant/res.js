import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/settions.js';
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
import 'fs';
import 'crypto';
import { setValue, userKey } from '../../../../model/utils/redisHelper.js';
import { normalizeDurationMinutes, readAction, isActionRunning, formatRemaining, remainingMs, startAction } from '../../../actionHelper.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(采药$)|(采药(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const game_action = await getGameFlag(usr_qq);
    if (+game_action == 1) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (player.occupation != '采药师') {
        Send(Text('您采药，您配吗?'));
        return false;
    }
    const timeRaw = e.MessageText.replace(/^(#|＃|\/)?采药/, '').replace('分钟', '');
    const time = normalizeDurationMinutes(timeRaw, 15, 48, 30);
    const current = await readAction(usr_qq);
    if (isActionRunning(current)) {
        Send(Text(`正在${current.action}中，剩余时间:${formatRemaining(remainingMs(current))}`));
        return false;
    }
    const action_time = time * 60 * 1000;
    const arr = await startAction(usr_qq, '采药', action_time, {
        plant: '0',
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1',
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await setValue(userKey(usr_qq, 'action'), arr);
    Send(Text(`现在开始采药${time}分钟`));
});
async function getGameFlag(userId) {
    return await import('../../../../model/utils/redisHelper.js').then(m => m.getString(userKey(userId, 'game_action')));
}

export { res as default, regular };
