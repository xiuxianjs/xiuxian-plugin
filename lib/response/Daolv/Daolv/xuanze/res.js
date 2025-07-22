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
import { Read_player, Read_qinmidu, Write_qinmidu, Add_najie_thing } from '../../../../model/xiuxian.js';
import { found } from '../daolv.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)^(我愿意|我拒绝)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.UserId != global.user_B)
        return false;
    if (global.x == 1) {
        let player_B = await Read_player(global.user_B);
        if (e.MessageText == '我愿意') {
            let qinmidu = await Read_qinmidu();
            let i = await found(global.user_A, global.user_B);
            if (i != qinmidu.length) {
                qinmidu[i].婚姻 = 1;
                await Write_qinmidu(qinmidu);
                Send(Text(`${player_B.名号}同意了你的请求`));
                await Add_najie_thing(global.user_A, '定情信物', '道具', -1);
            }
        }
        else if (e.MessageText == '我拒绝') {
            Send(Text(`${player_B.名号}拒绝了你的请求`));
        }
        clearTimeout(global.chaoshi_time);
        global.x = 0;
        return false;
    }
});

export { res as default, regular, selects };
