import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { readPlayer, readQinmidu, writeQinmidu } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Daolv, found } from '../daolv.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(我同意|我拒绝)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.UserId != Daolv.user_B)
        return false;
    if (Daolv.x == 2) {
        let player_A = await readPlayer(Daolv.user_A);
        let player_B = await readPlayer(Daolv.user_B);
        let qinmidu = await readQinmidu();
        let i = await found(Daolv.user_A, Daolv.user_B);
        if (i != qinmidu.length) {
            if (e.MessageText == '我同意') {
                qinmidu[i].婚姻 = 0;
                await writeQinmidu(qinmidu);
                Send(Text(`${player_A.名号}和${player_B.名号}和平分手`));
            }
            else if (e.MessageText == '我拒绝') {
                Send(Text(`${player_B.名号}拒绝了${player_A.名号}提出的建议`));
            }
        }
        clearTimeout(Daolv.chaoshi_time);
        Daolv.set_chaoshi_time(null);
        Daolv.set_x(0);
        return false;
    }
});

export { res as default, regular };
