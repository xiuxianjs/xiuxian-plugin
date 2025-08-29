import { useSend, Text } from 'alemonjs';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/api.js';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import { readDanyao } from '../../../../model/danyao.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我的药效$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const dy = await readDanyao(userId);
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    logger.info(dy);
    const parts = ['丹药效果:'];
    if (dy.ped > 0) {
        parts.push(`仙缘丹药力${(dy.beiyong1 * 100).toFixed(0)}%药效${dy.ped}次`);
    }
    if (dy.lianti > 0) {
        parts.push(`炼神丹药力${(dy.beiyong4 * 100).toFixed(0)}%药效${dy.lianti}次`);
    }
    if (dy.beiyong2 > 0) {
        parts.push(`神赐丹药力${(dy.beiyong3 * 100).toFixed(0)}%药效${dy.beiyong2}次`);
    }
    if (dy.biguan > 0) {
        parts.push(`辟谷丹药力${(dy.biguanxl * 100).toFixed(0)}%药效${dy.biguan}次`);
    }
    if ((player.islucky || 0) > 0) {
        parts.push(`福源丹药力${((player.addluckyNo || 0) * 100).toFixed(0)}%药效${player.islucky}次`);
    }
    if (player.breakthrough === true) {
        parts.push('破境丹生效中');
    }
    if (dy.xingyun > 0) {
        parts.push(`真器丹药力${dy.beiyong5}药效${dy.xingyun}次`);
    }
    void Send(Text(parts.join('\n')));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
