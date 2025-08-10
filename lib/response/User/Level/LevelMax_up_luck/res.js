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
import '@alemonjs/db';
import { existNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { LevelMax_up } from '../level.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?幸运破体$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let x = await existNajieThing(usr_qq, '幸运草', '道具');
    if (!x) {
        Send(Text('醒醒，你没有道具【幸运草】!'));
        return false;
    }
    LevelMax_up(e, true);
});

export { res as default, regular };
