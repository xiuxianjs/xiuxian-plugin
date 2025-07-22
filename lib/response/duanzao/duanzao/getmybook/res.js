import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
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
import { settripod } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)炼器师能力评测/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq))) {
        return false;
    }
    const player = await data.getData('player', user_qq);
    if (player.occupation != '炼器师') {
        Send(Text(`你还不是炼器师哦,宝贝`));
        return false;
    }
    if (player.锻造天赋) {
        Send(Text(`您已经测评过了`));
        return false;
    }
    const b = await settripod(user_qq);
    Send(Text(b));
});

export { res as default, name, regular, selects };
