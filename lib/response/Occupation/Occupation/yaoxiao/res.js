import { useSend, Text } from 'alemonjs';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Read_danyao, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)我的药效$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let dy = await Read_danyao(usr_qq);
    let player = await Read_player(usr_qq);
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

export { res as default, regular, selects };
