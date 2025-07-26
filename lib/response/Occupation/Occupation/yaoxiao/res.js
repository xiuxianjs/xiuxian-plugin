import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Read_danyao, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?我的药效$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let dy = await Read_danyao(usr_qq);
    let player = await readPlayer(usr_qq);
    let m = '丹药效果:';
    if (dy.ped > 0) {
        m += `\n仙缘丹药力${dy.beiyong1 * 100}%药效${dy.ped}次`;
    }
    if (dy.lianti > 0) {
        m += `\n炼神丹药力${dy.beiyong4 * 100}%药效${dy.lianti}次`;
    }
    if (dy.beiyong2 > 0) {
        m += `\n神赐丹药力${dy.beiyong3 * 100}% 药效${dy.beiyong2}次`;
    }
    if (dy.biguan > 0) {
        m += `\n辟谷丹药力${dy.biguanxl * 100}%药效${dy.biguan}次`;
    }
    if (player.islucky > 0) {
        m += `\n福源丹药力${player.addluckyNo * 100}%药效${player.islucky}次`;
    }
    if (player.breakthrough == true) {
        m += `\n破境丹生效中`;
    }
    if (dy.xingyun > 0) {
        m += `\n真器丹药力${dy.beiyong5}药效${dy.xingyun}次`;
    }
    Send(Text(m));
});

export { res as default, regular };
