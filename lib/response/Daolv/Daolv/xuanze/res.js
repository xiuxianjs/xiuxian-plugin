import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Read_player, Read_qinmidu, Write_qinmidu, Add_najie_thing } from '../../../../model/xiuxian.js';
import { found } from '../daolv.js';

const name = createEventName(import.meta.url);
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

export { res as default, name, regular, selects };
