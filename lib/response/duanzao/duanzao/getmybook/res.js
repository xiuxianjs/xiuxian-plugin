import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import { settripod } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian.js';
import '../../../../model/paths.js';
import 'dayjs';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?炼器师能力评测/;
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

export { res as default, regular };
