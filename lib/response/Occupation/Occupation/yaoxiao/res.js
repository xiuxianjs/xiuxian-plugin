import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { readDanyao } from '../../../../model/danyao.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/settions.js';
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
import '../../../../route/core/auth.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我的药效$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const dy = await readDanyao(usr_qq);
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    logger.info(dy);
    const parts = ['丹药效果:'];
    if (dy.ped > 0)
        parts.push(`仙缘丹药力${(dy.beiyong1 * 100).toFixed(0)}%药效${dy.ped}次`);
    if (dy.lianti > 0)
        parts.push(`炼神丹药力${(dy.beiyong4 * 100).toFixed(0)}%药效${dy.lianti}次`);
    if (dy.beiyong2 > 0)
        parts.push(`神赐丹药力${(dy.beiyong3 * 100).toFixed(0)}%药效${dy.beiyong2}次`);
    if (dy.biguan > 0)
        parts.push(`辟谷丹药力${(dy.biguanxl * 100).toFixed(0)}%药效${dy.biguan}次`);
    if ((player.islucky || 0) > 0)
        parts.push(`福源丹药力${((player.addluckyNo || 0) * 100).toFixed(0)}%药效${player.islucky}次`);
    if (player.breakthrough === true)
        parts.push('破境丹生效中');
    if (dy.xingyun > 0)
        parts.push(`真器丹药力${dy.beiyong5}药效${dy.xingyun}次`);
    Send(Text(parts.join('\n')));
    return false;
});

export { res as default, regular };
